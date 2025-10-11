import fetch, { HeadersInit } from "node-fetch";

export async function httpJson<T = any>(url: string, init: { method?: string; headers?: HeadersInit; body?: any } = {}): Promise<T> {
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    body: init.body ? JSON.stringify(init.body) : undefined
  });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status, body: json });
    return json as T;
  } catch (e: any) {
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status, body: text });
    throw e;
  }
}

