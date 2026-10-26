import type { UserRole } from "@/domain/User";
import { requireRole } from "@/lib/auth";
import { userService } from "@/services";
import { setUserActive } from "./actions";
import RoleSelect from "./RoleSelect";

const roles: Record<UserRole, string> = { student: "Student", partner: "Partner", admin: "Administrator" };

const errors: Record<string, string> = {
  "1": "Promjena nije uspjela. Pokušaj ponovno.",
  vlastiti: "Ne možeš deaktivirati vlastiti račun.",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; uloga?: string; greska?: string }>;
}) {
  const admin = await requireRole("admin");
  const { email, uloga, greska } = await searchParams;
  const role = uloga && uloga in roles ? (uloga as UserRole) : undefined;
  const users = await userService.list({ email: email?.trim() || undefined, role });

  return (
    <div>
      <h1 className="text-2xl font-bold">Korisnici</h1>
      {greska && errors[greska] && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{errors[greska]}</p>}

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="email"
          type="search"
          defaultValue={email}
          placeholder="Pretraži po e-mailu"
          aria-label="Pretraži po e-mailu"
          className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <RoleSelect roles={roles} defaultValue={role ?? ""} />
        <button className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Traži</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Ime</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Uloga</th>
              <th className="px-4 py-2 font-medium">Status studenta</th>
              <th className="px-4 py-2 font-medium">Račun</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2">{u.fullName ?? "—"}</td>
                <td className="px-4 py-2">{u.email || "—"}</td>
                <td className="px-4 py-2">{u.role ? roles[u.role] : "—"}</td>
                <td className="px-4 py-2">
                  {u.role === "student" ? (u.isVerifiedStudent() ? "potvrđen" : "nepotvrđen") : "—"}
                </td>
                <td className="px-4 py-2">
                  {u.isActive ? "aktivan" : <span className="text-red-700">deaktiviran</span>}
                </td>
                <td className="px-4 py-2 text-right">
                  {u.id !== admin.id && (
                    <form action={setUserActive}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="active" value={String(!u.isActive)} />
                      <button className="rounded border border-gray-300 px-3 py-1 hover:border-blue-700">
                        {u.isActive ? "Deaktiviraj" : "Aktiviraj"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-4 text-sm text-gray-500">Nema korisnika za zadane uvjete.</p>}
      </div>
    </div>
  );
}
