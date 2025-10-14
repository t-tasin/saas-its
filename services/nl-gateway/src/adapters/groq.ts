import { TicketParserInput } from "./index.js";
import { httpJson } from "../lib/http.js";

const endpoint = "https://api.groq.com/openai/v1/chat/completions";
const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instruct";
const key = process.env.GROQ_API_KEY!;

export async function parseWithGroq(input: TicketParserInput) {
  // Use custom system prompt if provided, otherwise use default
  const systemContent = input.systemPrompt || [
    "You convert helpdesk free-text into JSON that strictly matches the provided JSON schema.",
    "Only output valid JSON. No explanations. Use enum values exactly as provided.",
    "If unsure about a field, omit it.",
    "Create a short, specific title (≤120 chars).",
    "Map urgency words to priority; failure words to type=incident; requests/provisioning to type=request."
  ].join(" ");

  const messages = [
    { role: "system", content: systemContent },
    { role: "user", content: JSON.stringify({
      text: input.text,
      categories: input.categories,
      schema: input.schema
    }) }
  ];

  const body = {
    model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages
  };

  const res = await httpJson<any>(endpoint, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}` },
    body
  });

  const raw = res?.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(raw); } catch { return {}; }
}

