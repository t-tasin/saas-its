import express from "express";
import cors from "cors";
import { log } from "./lib/logger.js";
import { getCategories, flattenEnums } from "./lib/categories.js";
import { buildJsonSchema, CreateTicketDto } from "./lib/schema.js";
import { makeParser } from "./adapters/index.js";
import { autoTitle, rulePriority, ruleType } from "./lib/rules.js";
import { httpJson } from "./lib/http.js";

const PORT = Number(process.env.PORT ?? 3100);
const TICKET_BASE = process.env.TICKET_BASE!;

const app = express();

// Enable CORS for all origins (adjust for production if needed)
app.use(cors({
  origin: "*", // Allow all origins - you can restrict this to specific domains in production
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/healthz", (_, res) => res.json({ ok: true }));

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

