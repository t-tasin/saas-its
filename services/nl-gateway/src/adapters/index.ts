import type { CreateTicketDto } from "../lib/schema.js";
import { parseWithGroq } from "./groq.js";

export interface TicketParserInput {
  text: string;
  categories: any[];
  schema: any;
  systemPrompt?: string;
}

export interface TicketParser {
  parse(input: TicketParserInput): Promise<Partial<CreateTicketDto>>;
}

export function makeParser(): TicketParser {
  const provider = (process.env.LLM_PROVIDER ?? "groq").toLowerCase();
  switch (provider) {
    case "groq": return { parse: parseWithGroq };
    // case "gemini": return { parse: parseWithGemini };
    // case "ollama": return { parse: parseWithOllama };
    default: return { parse: parseWithGroq };
  }
}

