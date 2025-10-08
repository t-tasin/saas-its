'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

const nav: { href: Route; label: string }[] = [
  { href: '/tickets', label: 'Tickets' },
  { href: '/assets', label: 'Asset Management' },
  { href: '/reservation', label: 'Reservation' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white">
      <div className="px-4 py-5 border-b border-neutral-200">
        <div className="text-[11px] uppercase tracking-wider text-neutral-500">SaaS ITS</div>
        <div className="mt-1 text-lg font-semibold">Operator</div>
      </div>
      <nav className="p-2 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.href || pathname.startsWith(`${n.href}/` as string);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={[
                'block rounded-lg px-3 py-2 text-sm transition-[background,transform]',
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-800 hover:bg-neutral-100 hover:translate-x-[1px]',
              ].join(' ')}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
