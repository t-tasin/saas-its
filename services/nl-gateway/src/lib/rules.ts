export function ruleType(text: string): "incident" | "request" {
  const t = text.toLowerCase();
  const inc = /(down|outage|broken|bug|error|crash|cannot|can't|won't|fail|failure|not working)/.test(t);
  const req = /(request|need access|provision|install|change|upgrade|new|add|create)/.test(t);
  if (inc && !req) return "incident";
  if (req && !inc) return "request";
  return inc ? "incident" : "request";
}

export function rulePriority(text: string): "low"|"medium"|"high"|"urgent" {
  const t = text.toLowerCase();
  if (/(urgent|asap|immediately|sev1|p1|production down|critical|blocker)/.test(t)) return "urgent";
  if (/(high priority|escalated|today|tomorrow)/.test(t)) return "high";
  if (/(nice to have|when you can|no rush)/.test(t)) return "low";
  return "medium";
}

export function autoTitle(text: string) {
  const first = text.split(/[.!?\n]/)[0].trim();
  const title = first || "Ticket";
  return title.slice(0, 120);
}

