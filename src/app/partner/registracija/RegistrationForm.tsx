"use client";

import { useActionState } from "react";
import type { Category } from "@/repositories/CategoryRepository";
import { registerPartner, type RegistrationState } from "./actions";

const initialState: RegistrationState = {
  errors: {},
  values: { name: "", oib: "", categoryId: "", address: "", city: "", phone: "" },
};

const inputClass = "w-full rounded border border-gray-300 px-3 py-2";
const errorClass = "text-sm text-red-700";

export default function RegistrationForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(registerPartner, initialState);
  const errors = state.errors;
  const values = state.values;

  // Polja provjerava poslužitelj (noValidate), da poruke budu iste u svakom pregledniku.
  return (
    <form action={action} noValidate className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {errors.form && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-semibold">Naziv poslovnog subjekta</label>
        <input id="name" name="name" defaultValue={values.name} maxLength={200} className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="oib" className="block text-sm font-semibold">OIB</label>
        <input id="oib" name="oib" defaultValue={values.oib} inputMode="numeric" maxLength={11} className={inputClass} />
        {errors.oib && <p className={errorClass}>{errors.oib}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="categoryId" className="block text-sm font-semibold">Kategorija djelatnosti</label>
        <select id="categoryId" name="categoryId" defaultValue={values.categoryId} className={inputClass}>
          <option value="">Odaberi…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className={errorClass}>{errors.categoryId}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="address" className="block text-sm font-semibold">Adresa</label>
        <input id="address" name="address" defaultValue={values.address} maxLength={200} className={inputClass} />
        {errors.address && <p className={errorClass}>{errors.address}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="city" className="block text-sm font-semibold">Grad</label>
        <input id="city" name="city" defaultValue={values.city} maxLength={100} className={inputClass} />
        {errors.city && <p className={errorClass}>{errors.city}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-semibold">Kontakt telefon</label>
        <input id="phone" name="phone" type="tel" defaultValue={values.phone} maxLength={30} className={inputClass} />
        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
      </div>

      <button
        disabled={pending}
        className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pending ? "Spremanje…" : "Pošalji na odobrenje"}
      </button>
    </form>
  );
}
