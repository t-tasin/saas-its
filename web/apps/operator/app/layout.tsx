import './globals.css';
import Sidebar from '../components/shell/Sidebar';

export const metadata = {
  title: 'Operator Console',
  description: 'SaaS ITS — Operator UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-dvh">
          <Sidebar />
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
