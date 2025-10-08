// web/apps/operator/lib/format.ts
export function formatTicketNumber(createdAt: string | Date, number: number) {
    const d = new Date(createdAt);
    const y = String(d.getFullYear()).slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}-${number}`;
}
  
export function formatDateShort(iso?: string | null) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' });
}
  