'use client';

import { useEffect, useState } from 'react';
import type { Ticket, TicketComment } from '../../lib/api';
import { getTicketComments, postComment, patchTicketStatus } from '../../lib/api';

type Props = { ticket: Ticket | null; onClose: () => void };

export default function RightPanel({ ticket, onClose }: Props) {
  const open = Boolean(ticket);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newBody, setNewBody] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!ticket) return setComments([]);
      try {
        const list = await getTicketComments(ticket.id);
        if (active) setComments(list);
      } catch {
        if (active) setComments([]);
      }
    })();
    return () => { active = false; };
  }, [ticket?.id]);

  const status = ticket?.status ?? 'open';

  async function submitComment() {
    if (!ticket || !newBody.trim()) return;
    setBusy(true);
    try {
      const created = await postComment(ticket.id, newBody.trim());
      setComments((prev) => [...prev, created]);
      setNewBody('');
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(next: string) {
    if (!ticket) return;
    setBusy(true);
    try {
      await patchTicketStatus(ticket.id, next);
      ticket.status = next as Ticket['status'];
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={[
        'fixed inset-y-0 right-0 z-40 w-[440px] transform border-l border-neutral-200 bg-white shadow-xl transition-transform',
        open ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{ticket?.title ?? '—'}</h3>
          <p className="truncate text-xs text-neutral-500">{ticket?.id}</p>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-800 hover:bg-neutral-100 transition-[background,transform] hover:translate-y-[1px]"
        >
          Close
        </button>
      </header>

      <div className="space-y-6 px-4 py-4">
        {/* Actions */}
        <section>
          <h4 className="mb-2 text-sm font-medium">Actions</h4>
          <div className="inline-flex items-center gap-0 rounded-md border border-neutral-300 bg-white p-0.5">
            {(['open','in_progress','resolved','closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                aria-current={status === s ? 'page' : undefined}
                className={[
                  'rounded-[6px] px-3 py-1.5 text-sm',
                  status === s ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100',
                ].join(' ')}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section>
          <h4 className="mb-2 text-sm font-medium">Summary</h4>
          <p className="whitespace-pre-wrap text-sm text-neutral-700">{ticket?.description || '—'}</p>
        </section>

        {/* Attachments */}
        <section>
          <h4 className="mb-2 text-sm font-medium">Attachments</h4>
          <p className="text-sm text-neutral-500">Coming soon</p>
        </section>

        {/* Activity */}
        <section>
          <h4 className="mb-3 text-sm font-medium">Activity</h4>
          <div className="space-y-3">
            {comments.length === 0 && <p className="text-sm text-neutral-500">No comments yet.</p>}
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-neutral-200 p-3">
                <div className="mb-1 text-xs text-neutral-500">
                  {c.authorId} • {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">{c.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2">
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={2}
              placeholder="Add a comment…"
              className="min-h-[40px] flex-1 resize-y rounded-md border border-neutral-300 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
            <button
              onClick={submitComment}
              disabled={busy || !newBody.trim()}
              className="inline-flex items-center rounded-md bg-neutral-900 px-3 py-2 text-sm text-white transition-[transform] hover:translate-y-[1px] disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
