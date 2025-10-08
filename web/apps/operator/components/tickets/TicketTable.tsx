'use client';

import { useState } from 'react';
import type { Ticket } from '../../lib/api';
import { formatDateShort, formatTicketNumber } from '../../lib/format';
import RightPanel from './RightPanel';

type Props = { tickets: Ticket[]; context: 'helpdesk' | 'escalated' };

export default function TicketTable({ tickets }: Props) {
  const [selected, setSelected] = useState<Ticket | null>(null);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Ticket #</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Caller</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Operator</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Target date</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Category</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Subcategory</th>
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Operator group</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 && (
                <tr className="border-t border-neutral-100">
                  <td colSpan={8} className="px-3 py-10 text-center text-neutral-500">
                    No tickets found.
                  </td>
                </tr>
              )}
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="cursor-pointer border-t border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-3 py-3 font-medium text-neutral-900">
                    {formatTicketNumber(t.createdAt, t.number)}
                  </td>
                  <td className="px-3 py-3">{t.requestedByName ?? '—'}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-md border border-neutral-300 px-2 py-0.5 text-xs">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">{t.operatorName ?? '—'}</td>
                  <td className="px-3 py-3">{formatDateShort(t.targetDate)}</td>
                  <td className="px-3 py-3">{t.category ?? '—'}</td>
                  <td className="px-3 py-3">{t.subcategory ?? '—'}</td>
                  <td className="px-3 py-3">{t.operatorGroup ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* overlay + drawer */}
      {Boolean(selected) && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]" onClick={() => setSelected(null)} />
      )}
      <RightPanel ticket={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
