# NL Gateway Service

A microservice that converts natural language text into structured ticket data using LLMs (default: Groq).

## Features

- 🤖 **LLM-powered parsing**: Converts free text to structured ticket data
- 🔒 **Category binding**: Hard-binds to actual categories from ticket-svc (no hallucinations)
- ✅ **Validation**: Double-checks output against ticket DTO
- 🔄 **Forwarding**: Passes validated data to ticket-svc
- 🛡️ **Fallback rules**: Server-side defaults if LLM fails
- 🔌 **Swappable adapters**: Easy to add Gemini, Ollama, or other providers

## Quick Start

### Development

```bash
cd services/nl-gateway
npm install
cp .env.example .env
# Edit .env with your Groq API key
npm run dev
```

### Production (Docker)

```bash
docker compose up -d --build nl-gateway
```

## API

### Health Check

```bash
GET /healthz
```

### Create Ticket from Natural Language

```bash
POST /nl/tickets
Content-Type: application/json

{
  "text": "My laptop keeps overheating during Zoom calls. Very urgent!",
  "fallback": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Response**: 201 with the created ticket object from ticket-svc

## Configuration

See `.env.example` for all configuration options:

- `LLM_PROVIDER`: groq | gemini | ollama (default: groq)
- `GROQ_API_KEY`: Your Groq API key
- `GROQ_MODEL`: llama-3.1-8b-instruct (or other)
- `TICKET_BASE`: URL to ticket-svc (e.g., http://ticket-svc:3000/v1)
- `X_TENANT_ID`: Tenant ID for multi-tenant setup
- `PORT`: Service port (default: 3100)
- `CATEGORIES_TTL`: Cache time for categories (default: 120000ms)

## How It Works

1. **Fetch Categories**: Gets real categories from ticket-svc
2. **LLM Parse**: Sends text + categories + JSON schema to LLM
3. **Validate & Default**: Applies server-side rules and validation
4. **Forward**: Sends validated DTO to ticket-svc's POST /v1/tickets
5. **Return**: Returns the created ticket

## Adding More LLM Providers

Create a new adapter in `src/adapters/` (e.g., `gemini.ts` or `ollama.ts`) with the same signature:

```ts
export async function parseWithYourProvider(input: TicketParserInput) {
  // Your implementation
  return parsedObject;
}
```

Then update `src/adapters/index.ts` to include it in the switch statement.

## Failure Modes

- **LLM returns bad JSON**: Falls back to rule-based parsing
- **Unknown categories**: Drops invalid category/subcategory IDs
- **Missing fields**: Applies smart defaults (title, type, priority)
- **Validation fails**: Returns 400 with error details

## Testing

```bash
# Health check
curl http://localhost:3100/healthz

# Create ticket
curl -X POST http://localhost:3100/nl/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "text":"Network down in Building A. Critical issue!",
    "fallback":{"name":"John Doe","email":"john@example.com"}
  }'
```

## Notes

- This service **does not** modify ticket-svc or any other existing services
- The existing manual "Create Ticket" UI continues to work unchanged
- This is purely additive functionality
- LLM responses are cached for efficiency
- All ticket creation still happens in ticket-svc

