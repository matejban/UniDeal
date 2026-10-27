"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Pretraga po e-mailu dok se tipka; upit ide tek 500 ms nakon zadnjeg slova.
// router.replace osvježava popis bez ponovnog učitavanja stranice, pa polje zadržava kursor.
export default function EmailSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function search(value: string) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) params.set("email", value.trim());
      else params.delete("email");
      router.replace(`${pathname}?${params}`);
    }, 500);
  }

  return (
    <input
      name="email"
      type="search"
      defaultValue={defaultValue}
      onChange={(e) => search(e.currentTarget.value)}
      placeholder="Pretraži po e-mailu"
      aria-label="Pretraži po e-mailu"
      className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2"
    />
  );
}
