"use client";

// u tablici je samo ikona, na stranici za uređivanje gumb s tekstom
export default function DeleteOfferButton({
  action,
  title,
  icon = false,
}: {
  action: () => Promise<void>;
  title: string;
  icon?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Obrisati ponudu „${title}”? Ovo se ne može poništiti.`)) {
          e.preventDefault();
        }
      }}
    >
      {icon ? (
        <button
          aria-label={`Obriši ponudu ${title}`}
          title="Obriši ponudu"
          className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      ) : (
        <button className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
          Obriši ponudu
        </button>
      )}
    </form>
  );
}
