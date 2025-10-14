import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { log } from "./lib/logger.js";
import { getCategories, flattenEnums } from "./lib/categories.js";
import { buildJsonSchema, CreateTicketDto, TriageResponseDto } from "./lib/schema.js";
import { makeParser } from "./adapters/index.js";
import { autoTitle, rulePriority, ruleType } from "./lib/rules.js";
import { httpJson } from "./lib/http.js";

/**
 * Fetch busy times for a technician from appointments service
 */
async function getTechnicianBusyTimes(technicianId: string, timeMin: string, timeMax: string) {
  const APPT_BASE = process.env.APPT_BASE;
  if (!APPT_BASE) {
    console.log('APPT_BASE not configured, skipping busy time check');
    return [];
  }
  
  try {
    const url = `${APPT_BASE}/appointments/debug/busy/${technicianId}?timeMin=${timeMin}&timeMax=${timeMax}`;
    console.log(`[nl-gateway] Calling appointments-svc debug endpoint: ${url}`);
    const response = await httpJson(url);
    console.log(`[nl-gateway] Received response:`, JSON.stringify(response, null, 2));
    return response.busySlots || [];
  } catch (error) {
    console.error('Failed to fetch busy times:', error);
    return []; // Return empty array on error to not block the flow
  }
}

const PORT = Number(process.env.PORT ?? 3100);
const TICKET_BASE = process.env.TICKET_BASE!;
const APPT_BASE = process.env.APPT_BASE || '';
const APPT_DURATION = Number(process.env.APPT_DURATION || 30);
const APPT_TZ = process.env.APPT_TZ || 'America/New_York';
const APPT_LOCATION = process.env.APPT_LOCATION || 'IT Desk';
const HARDWARE_TECH_ID = process.env.HARDWARE_TECH_ID || 'tech_hardware';

// Simple in-memory store for correlation data (use Redis in production)
const correlationStore = new Map();

const app = express();

// Enable CORS for all origins (adjust for production if needed)
app.use(cors({
  origin: "*", // Allow all origins - you can restrict this to specific domains in production
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/healthz", (_, res) => res.json({ ok: true }));

/**
 * POST /nl/tickets/analyze
 * Step 1: Analyze ticket text and determine if hardware visit is needed
 */
app.post("/nl/tickets/analyze", async (req, res) => {
  try {
    const { text, fallback } = req.body ?? {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text (string) is required" });
    }

    // 1) Load categories and schema
    const cats = await getCategories();
    const { categoryEnum, subcategoryEnum } = flattenEnums(cats);
    const schema = buildJsonSchema(categoryEnum, subcategoryEnum);

    // 2) Call LLM with enhanced system prompt
    const parser = makeParser();
    const systemPrompt = `You are an IT support ticket analyzer. 
Extract ticket information from user text.

CRITICAL RULES FOR HARDWARE DETECTION:
- Detect HARDWARE issues: fan noise, overheating hardware, broken screen/keyboard/ports/power/battery, 
  liquid damage, device won't power on, rattling sounds, swollen battery, physical damage, hardware malfunction.
- For hardware issues: set hardwareVisitRequired=true and issueComponent="hardware"
- For software/account/network issues: set hardwareVisitRequired=false
- If user mentions specific times (e.g. "tomorrow 10-12", "Monday 2-4pm"), parse to ISO8601 in availability array
- Otherwise leave availability empty - the system will ask for weekly availability

Output ONLY valid JSON matching the schema.`;

    let parsed: any = await parser.parse({ text, categories: cats, schema, systemPrompt });

    // 3) Apply defaults (NO ZOD VALIDATION HERE - we'll do it on finalize)
    if (!parsed.title) parsed.title = autoTitle(text);
    if (!parsed.type) parsed.type = ruleType(text);
    if (!parsed.priority) parsed.priority = rulePriority(text);

    // Apply fallback name/email if provided
    if (!parsed.requesterName && fallback?.name) {
      parsed.requesterName = String(fallback.name).slice(0, 120);
    }
    if (!parsed.requesterEmail && fallback?.email) {
      parsed.requesterEmail = fallback.email;
    }

    // Clean up category IDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (parsed.categoryId && (!uuidRegex.test(parsed.categoryId) || !categoryEnum.includes(parsed.categoryId))) {
      delete parsed.categoryId;
    }
    if (parsed.subcategoryId && (!uuidRegex.test(parsed.subcategoryId) || !subcategoryEnum.includes(parsed.subcategoryId))) {
      delete parsed.subcategoryId;
    }

    // 4) Determine if followup is needed
    const needsFollowup = parsed.hardwareVisitRequired === true && 
                          (!parsed.availability || parsed.availability.length === 0);

    const correlationId = uuidv4();
    
    // Store parsed data for finalize step
    correlationStore.set(correlationId, {
      parsed: parsed,
      timestamp: Date.now(),
    });

    // Clean up old correlations (> 1 hour)
    for (const [key, value] of correlationStore.entries()) {
      if (Date.now() - value.timestamp > 3600000) {
        correlationStore.delete(key);
      }
    }

    // 5) Build response
    const response: any = {
      correlationId,
      needsFollowup,
      parsed: parsed,
      meta: {
        issueComponent: parsed.issueComponent || 'unknown',
        hardwareVisitRequired: parsed.hardwareVisitRequired || false,
        availability: parsed.availability || [],
      },
    };

    if (needsFollowup) {
      // Generate week availability spec with technician busy times filtered out
      const today = new Date();
      const days = [];
      
      // Calculate time range for busy time check (next 5 business days)
      // Start from today to include today's busy slots (but we'll filter past slots in the frontend)
      const timeMin = new Date(today);
      timeMin.setHours(0, 0, 0, 0);
      
      // End 10 days from today to ensure we cover 5 business days
      const timeMax = new Date(today);
      timeMax.setDate(today.getDate() + 10);
      timeMax.setHours(23, 59, 59, 999);
      
      // Fetch technician busy times for the entire range
      const HARDWARE_TECH_ID = process.env.HARDWARE_TECH_ID || 'tech_hardware';
      console.log(`[nl-gateway] Fetching busy times for technician ${HARDWARE_TECH_ID}`);
      console.log(`[nl-gateway] Time range: ${timeMin.toISOString()} to ${timeMax.toISOString()}`);
      console.log(`[nl-gateway] Time range (local): ${timeMin.toLocaleString()} to ${timeMax.toLocaleString()}`);
      
      const busySlots = await getTechnicianBusyTimes(HARDWARE_TECH_ID, timeMin.toISOString(), timeMax.toISOString());
      
      console.log(`[nl-gateway] Found ${busySlots.length} busy slots for technician ${HARDWARE_TECH_ID}`);
      console.log(`[nl-gateway] Busy slots details:`, busySlots.map((slot: { start: string; end: string }) => ({
        start: slot.start,
        end: slot.end,
        startLocal: new Date(slot.start).toLocaleString(),
        endLocal: new Date(slot.end).toLocaleString()
      })));
      
      // Additional debug: log the raw response from appointments-svc
      console.log(`[nl-gateway] Raw busy slots response:`, JSON.stringify(busySlots, null, 2));
      
      // Generate next 5 working days (excluding weekends)
      let workingDaysAdded = 0;
      let dayOffset = 0; // Start from today
      
      while (workingDaysAdded < 5) {
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const dateStr = date.toISOString().split('T')[0];
          
          // Generate available time slots for this day (30-min intervals from 9 AM to 5 PM)
          const availableSlots = [];
          for (let hour = 9; hour < 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const slotStart = new Date(date);
              slotStart.setHours(hour, minute, 0, 0);
              const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
              
              // Check if this is today and if the slot is in the past
              const isToday = dateStr === today.toISOString().split('T')[0];
              
              // For past slot detection, we need to consider the user's timezone
              // Since we're generating slots in UTC but need to compare with user's local time,
              // we should let the frontend handle past slot detection instead of doing it here
              const isPastSlot = false; // Let frontend handle past slot detection
              
              console.log(`[nl-gateway] Slot ${slotStart.toISOString()} - isToday: ${isToday}, isPastSlot: ${isPastSlot}, slotStart <= today: ${slotStart <= today}`);
              
              // Check if this slot overlaps with any busy time
              const isBusy = busySlots.some((busy: { start: string; end: string }) => {
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);
                const overlaps = !(slotEnd <= busyStart || slotStart >= busyEnd);
                
                if (overlaps) {
                  console.log(`[nl-gateway] Slot ${slotStart.toISOString()} overlaps with busy slot ${busy.start} - ${busy.end}`);
                  console.log(`[nl-gateway]   Slot: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
                  console.log(`[nl-gateway]   Busy: ${busyStart.toISOString()} - ${busyEnd.toISOString()}`);
                }
                
                return overlaps;
              });
              
              const isAvailable = !isPastSlot && !isBusy;
              
              availableSlots.push({
                time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                available: isAvailable
              });
            }
          }
          
          days.push({
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: dateStr,
            startOfDay: '09:00',
            endOfDay: '17:00',
            slots: availableSlots
          });
          
          workingDaysAdded++;
        }
        
        dayOffset++;
      }

      response.followupKind = 'availability_week';
      response.followupQuestion = 'This looks like a hardware issue that may require an on-site visit. Please share your availability for a 30-minute appointment over the next 5 business days.';
      response.weekAvailabilitySpec = {
        timezone: APPT_TZ,
        granularityMinutes: 30,
        days,
      };
    }

    return res.json(response);
  } catch (err: any) {
    log.error({ err }, "nl-gateway analyze error");
    return res.status(500).json({ error: err?.message ?? "internal error" });
  }
});

/**
 * POST /nl/tickets/finalize
 * Step 2: Create ticket and book appointment if needed
 */
app.post("/nl/tickets/finalize", async (req, res) => {
  try {
    const { correlationId, availability, fallback, assetId } = req.body ?? {};
    
    if (!correlationId) {
      return res.status(400).json({ error: "correlationId is required" });
    }

    // Retrieve parsed data
    const stored = correlationStore.get(correlationId);
    if (!stored) {
      return res.status(404).json({ error: "Correlation ID not found or expired" });
    }

    const parsed = stored.parsed;
    
    // Update with user-provided availability if present
    if (availability && Array.isArray(availability) && availability.length > 0) {
      parsed.availability = availability;
    }

    // ALWAYS prefer user-provided fallback over AI guesses
    if (fallback?.name) {
      parsed.requesterName = String(fallback.name).slice(0, 120);
    }
    if (fallback?.email) {
      parsed.requesterEmail = fallback.email;
    }

    // Sanitize category IDs to ensure they are valid UUIDs or undefined
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof parsed.categoryId !== 'string' || !uuidRegex.test(parsed.categoryId)) {
      parsed.categoryId = undefined;
    }
    if (typeof parsed.subcategoryId !== 'string' || !uuidRegex.test(parsed.subcategoryId)) {
      parsed.subcategoryId = undefined;
    }

    // Build ticket DTO
    const ticketDto: any = {
      title: parsed.title,
      description: parsed.description,
      type: parsed.type,
      priority: parsed.priority,
      requesterName: parsed.requesterName,
      requesterEmail: parsed.requesterEmail,
      ...(parsed.categoryId ? { categoryId: parsed.categoryId } : {}),
      ...(parsed.subcategoryId ? { subcategoryId: parsed.subcategoryId } : {}),
      assetId: assetId || undefined,
    };

    // Create ticket
    const ticket = await httpJson(`${TICKET_BASE}/tickets`, { 
      method: "POST", 
      body: ticketDto 
    });

    log.info({ ticketId: ticket.id, hardware: parsed.hardwareVisitRequired }, "Ticket created");

    // Book appointment if hardware visit required
    let appointment = null;
    
    // DEBUG: Log all the conditions
    console.log("=== APPOINTMENT BOOKING DEBUG ===");
    console.log("hardwareVisitRequired:", parsed.hardwareVisitRequired);
    console.log("availability:", parsed.availability);
    console.log("availability.length:", parsed.availability?.length);
    console.log("APPT_BASE:", APPT_BASE);
    console.log("HARDWARE_TECH_ID:", HARDWARE_TECH_ID);
    console.log("APPT_DURATION:", APPT_DURATION);
    console.log("APPT_TZ:", APPT_TZ);
    console.log("APPT_LOCATION:", APPT_LOCATION);
    
    if (parsed.hardwareVisitRequired && parsed.availability && parsed.availability.length > 0 && APPT_BASE) {
      const bookingPayload = {
        technicianId: HARDWARE_TECH_ID,
        windows: parsed.availability,
        durationMinutes: APPT_DURATION,
        requester: {
          name: parsed.requesterName || 'Unknown',
          email: parsed.requesterEmail || 'unknown@example.com',
        },
        summary: `Hardware visit: ${parsed.title}`,
        description: `Ticket #${ticket.number}\n\n${parsed.description || ''}`,
        location: APPT_LOCATION,
        timezone: APPT_TZ,
        ticketId: ticket.id,
      };
      
      console.log("Booking payload:", JSON.stringify(bookingPayload, null, 2));
      
      try {
        const apptUrl = `${APPT_BASE}/appointments/auto`;
        console.log("Calling appointments API at:", apptUrl);
        
        appointment = await httpJson(apptUrl, {
          method: "POST",
          body: bookingPayload,
        });
        
        console.log("Appointment booked successfully:", appointment);
        log.info({ appointmentId: appointment.id, ticketId: ticket.id }, "Appointment booked");
      } catch (apptError: any) {
        console.error("Appointment booking failed:", apptError);
        log.error({ error: apptError, message: apptError.message, stack: apptError.stack }, "Failed to book appointment, but ticket was created");
        // Don't fail the whole request - ticket was created
      }
    } else {
      console.log("Skipping appointment booking - conditions not met");
      if (!parsed.hardwareVisitRequired) console.log("  - Not a hardware issue");
      if (!parsed.availability || parsed.availability.length === 0) console.log("  - No availability provided");
      if (!APPT_BASE) console.log("  - APPT_BASE not configured");
    }

    // Clean up correlation data
    correlationStore.delete(correlationId);

    return res.status(201).json({
      ticket,
      appointment,
      notes: appointment 
        ? "Hardware appointment booked; add to calendar with the link provided."
        : undefined,
    });
  } catch (err: any) {
    log.error({ err }, "nl-gateway finalize error");
    const status = err?.status ?? 500;
    return res.status(status).json({ error: err?.body ?? err?.message ?? "internal error" });
  }
});

app.post("/nl/tickets", async (req, res) => {
  try {
    const { text, fallback } = req.body ?? {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text (string) is required" });
    }

    // 1) Load categories and schema-bind enums
    const cats = await getCategories();
    const { categoryEnum, subcategoryEnum } = flattenEnums(cats);
    const schema = buildJsonSchema(categoryEnum, subcategoryEnum);

    // 2) Call LLM adapter (Groq by default)
    const parser = makeParser();
    let parsed = await parser.parse({ text, categories: cats, schema });

    // 3) Server-side guards / defaults
    if (!parsed.title) parsed.title = autoTitle(text);
    if (!parsed.type) parsed.type = ruleType(text);
    if (!parsed.priority) parsed.priority = rulePriority(text);

    // Optional: allow passing fallback requester info when user is anon
    if (!parsed.requesterName && fallback?.name) parsed.requesterName = String(fallback.name).slice(0, 120);
    if (!parsed.requesterEmail && fallback?.email) parsed.requesterEmail = fallback.email;

    // If categoryId/subcategoryId are not valid UUIDs or not in enums, drop them
    // We're very aggressive here - if it's not a perfect UUID match, we drop it
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (parsed.categoryId) {
      if (typeof parsed.categoryId !== 'string' || !uuidRegex.test(parsed.categoryId) || !categoryEnum.includes(parsed.categoryId)) {
        delete parsed.categoryId;
      }
    }
    if (parsed.subcategoryId) {
      if (typeof parsed.subcategoryId !== 'string' || !uuidRegex.test(parsed.subcategoryId) || !subcategoryEnum.includes(parsed.subcategoryId)) {
        delete parsed.subcategoryId;
      }
    }

    // 4) Validate against your ticket DTO
    const dto = CreateTicketDto.parse(parsed);

    // 5) Forward to ticket-svc
    const created = await httpJson(`${TICKET_BASE}/tickets`, { method: "POST", body: dto });

    return res.status(201).json(created);
  } catch (err: any) {
    log.error({ err }, "nl-gateway error");
    const status = err?.status ?? 500;
    return res.status(status).json({ error: err?.body ?? err?.message ?? "internal error" });
  }
});

app.listen(PORT, () => log.info({ PORT }, "nl-gateway listening"));

