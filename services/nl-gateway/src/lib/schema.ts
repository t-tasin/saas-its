import { z } from "zod";

export const CreateTicketDto = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  type: z.enum(["incident", "request"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  requestedBy: z.string().optional(),
  requesterName: z.string().optional(),
  requesterEmail: z.string().email().optional(),
  categoryId: z.string().uuid().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  subcategoryId: z.string().uuid().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  assetId: z.string().uuid().optional()
});
export type CreateTicketDto = z.infer<typeof CreateTicketDto>;

// Extended schema for AI triage
export const TriageResponseDto = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  type: z.enum(["incident", "request"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  requesterName: z.string().optional(),
  requesterEmail: z.string().email().optional(),
  categoryId: z.string().uuid().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  subcategoryId: z.string().uuid().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  issueComponent: z.enum(["hardware", "software", "network", "account", "unknown"]).optional(),
  hardwareVisitRequired: z.boolean().optional(),
  availability: z.array(z.object({
    start: z.string(),
    end: z.string()
  })).optional()
});
export type TriageResponseDto = z.infer<typeof TriageResponseDto>;

export function buildJsonSchema(categoryEnum: string[], subcategoryEnum: string[]) {
  return {
    type: "object",
    required: ["title"],          // keep minimal required; enforce later via Zod + defaults
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 3, maxLength: 120 },
      description: { type: "string", maxLength: 2000 },
      type: { type: "string", enum: ["incident", "request"] },
      priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
      requestedBy: { type: "string" },
      requesterName: { type: "string" },
      requesterEmail: { type: "string", format: "email" },
      categoryId: { type: "string", enum: categoryEnum },
      subcategoryId: { type: "string", enum: subcategoryEnum },
      // NEW: Hardware triage fields
      issueComponent: { type: "string", enum: ["hardware", "software", "network", "account", "unknown"] },
      hardwareVisitRequired: { type: "boolean" },
      availability: {
        type: "array",
        items: {
          type: "object",
          required: ["start", "end"],
          properties: {
            start: { type: "string", format: "date-time" },
            end: { type: "string", format: "date-time" }
          }
        }
      }
    }
  };
}

