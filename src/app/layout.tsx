import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniDeal",
  description: "Platforma za studentske pogodnosti i popuste",
};

const links = [
  { href: "/ponude", label: "Ponude" },
  { href: "/karta", label: "Karta" },
  { href: "/student", label: "Student" },
  { href: "/partner", label: "Partner" },
  { href: "/admin", label: "Admin" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="hr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/" className="text-lg font-bold text-blue-700">
              UniDeal
            </Link>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm hover:text-blue-700">
                {l.label}
              </Link>
            ))}
            {user ? (
              <form action="/auth/signout" method="post" className="ml-auto flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:border-blue-700">
                  Odjava
                </button>
              </form>
            ) : (
              <Link
                href="/prijava"
                className="ml-auto rounded bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800"
              >
                Prijava
              </Link>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
