import Link from "next/link";
import { requireRole } from "@/lib/auth";

// Sve stranice pod /admin dostupne su samo administratoru. Server Actioni moraju provjeravati ulogu i sami.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");

  return (
    <div>
      <nav className="mb-6 flex gap-4 text-sm">
        <Link href="/admin" className="hover:text-blue-700">
          Pregled
        </Link>
        <Link href="/admin/korisnici" className="hover:text-blue-700">
          Korisnici
        </Link>
      </nav>
      {children}
    </div>
  );
}
