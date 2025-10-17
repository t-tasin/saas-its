import { httpJson } from "./http.js";

const TICKET_BASE = process.env.TICKET_BASE!;
const TTL = Number(process.env.CATEGORIES_TTL ?? 120000);

let cache: any[] = [];
let at = 0;

export async function getCategories(): Promise<any[]> {
  const now = Date.now();
  if (cache.length && now - at < TTL) return cache;
  
  try {
    cache = await httpJson<any[]>(`${TICKET_BASE}/tickets/catalog/categories`);
    at = now;
    return cache;
  } catch (error) {
    console.warn('Failed to fetch categories, proceeding without category validation:', error);
    // Return empty array if categories can't be fetched
    // This allows ticket creation without categories
    return [];
  }
}

/** Flatten to arrays used for enum binding */
export function flattenEnums(categories: any[]) {
  const catIds = new Set<string>();
  const subIds = new Set<string>();
  for (const c of categories) {
    if (c?.id) catIds.add(c.id);
    for (const s of c?.subcategories ?? []) {
      if (s?.id) subIds.add(s.id);
    }
  }
  return {
    categoryEnum: [...catIds],
    subcategoryEnum: [...subIds]
  };
}
