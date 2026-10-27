"use client";

// Odabir uloge odmah šalje obrazac za pretragu, bez klika na „Traži”.
export default function RoleSelect({ roles, defaultValue }: { roles: Record<string, string>; defaultValue: string }) {
  return (
    <select
      name="uloga"
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      aria-label="Uloga"
      className="rounded border border-gray-300 px-3 py-2"
    >
      <option value="">Sve uloge</option>
      {Object.entries(roles).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
