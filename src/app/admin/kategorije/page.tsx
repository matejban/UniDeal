import { requireRole } from "@/lib/auth";
import { categoryService } from "@/services";
import { createCategory, deleteCategory, renameCategory } from "./actions";

type SearchParams = { greska?: string; ponuda?: string; partnera?: string };

function inUseMessage(offers: number, partners: number): string {
  const users: string[] = [];
  if (offers > 0) users.push(`ponuda: ${offers}`);
  if (partners > 0) users.push(`partnera: ${partners}`);
  return `Kategorija se ne može ukloniti dok je koriste ponude ili partneri (${users.join(", ")}).`;
}

// Tekst poruke određuje stranica, a iz URL-a dolaze samo kod i brojevi, pa se poruka ne može podmetnuti.
function errorMessage({ greska, ponuda, partnera }: SearchParams): string {
  switch (greska) {
    case "prazan-naziv":
      return "Upiši naziv kategorije.";
    case "zauzet-naziv":
      return "Kategorija s tim nazivom već postoji.";
    case "u-upotrebi":
      return inUseMessage(Number.parseInt(ponuda ?? "", 10) || 0, Number.parseInt(partnera ?? "", 10) || 0);
    default:
      return "Promjena nije spremljena. Pokušaj ponovno.";
  }
}

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireRole("admin");
  const params = await searchParams;
  const categories = await categoryService.getAllWithUsage();

  return (
    <div>
      <h1 className="text-2xl font-bold">Kategorije ponuda</h1>
      {params.greska && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{errorMessage(params)}</p>}

      <form action={createCategory} className="mt-6 flex gap-2 text-sm">
        <input
          name="name"
          required
          aria-label="Naziv nove kategorije"
          placeholder="Nova kategorija"
          className="rounded border border-gray-300 px-3 py-1"
        />
        <button className="rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-800">Dodaj</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Naziv</th>
              <th className="px-4 py-2 font-medium">Ponude</th>
              <th className="px-4 py-2 font-medium">Partneri</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2">
                  <form action={renameCategory} className="flex gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      key={c.name}
                      name="name"
                      required
                      defaultValue={c.name}
                      aria-label={`Novi naziv kategorije ${c.name}`}
                      className="rounded border border-gray-300 px-3 py-1"
                    />
                    <button className="rounded border border-gray-300 px-3 py-1 hover:border-blue-700 hover:text-blue-700">
                      Preimenuj
                    </button>
                  </form>
                </td>
                <td className="px-4 py-2">{c.offerCount}</td>
                <td className="px-4 py-2">{c.partnerCount}</td>
                <td className="px-4 py-2">
                  <form action={deleteCategory} className="flex justify-end">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="rounded border border-gray-300 px-3 py-1 hover:border-red-700 hover:text-red-700">
                      Ukloni
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-4 text-sm text-gray-500">Nema kategorija.</p>}
      </div>
    </div>
  );
}
