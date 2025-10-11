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
  subcategoryId: z.string().uuid().optional().or(z.literal('')).transform(val => val === '' ? undefined : val)
});
export type CreateTicketDto = z.infer<typeof CreateTicketDto>;

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
      subcategoryId: { type: "string", enum: subcategoryEnum }
    }
  };
}

