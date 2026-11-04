"use client";

import { useActionState, type ComponentProps } from "react";
import type { Category } from "@/repositories/CategoryRepository";
import type { PartnerRegistration } from "@/services/PartnerService";
import { registerPartner, type RegistrationState } from "./actions";

const initialState: RegistrationState = {
  errors: {},
  values: { name: "", oib: "", categoryId: "", address: "", city: "", phone: "" },
};

// Poruka o grešci ispod polja; polje je s njom povezano preko aria-describedby.
function FieldError({ name, message }: { name: string; message?: string }) {
  return message ? <p id={`${name}-greska`} className="text-sm text-red-700">{message}</p> : null;
}

function Field({
  name,
  label,
  state,
  ...props
}: { name: keyof PartnerRegistration; label: string; state: RegistrationState } & ComponentProps<"input">) {
  const error = state.errors[name];
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-semibold">{label}</label>
      <input
        id={name}
        name={name}
        defaultValue={state.values[name]}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-greska` : undefined}
        className="w-full rounded border border-gray-300 px-3 py-2"
        {...props}
      />
      <FieldError name={name} message={error} />
    </div>
  );
}

export default function RegistrationForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(registerPartner, initialState);
  const { errors, values } = state;

  // Provjeru polja radi poslužitelj (noValidate), da poruke budu iste u svakom pregledniku.
  return (
    <form action={action} noValidate className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {errors.form && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}
      <Field name="name" label="Naziv poslovnog subjekta" state={state} required maxLength={200} />
      <Field name="oib" label="OIB" state={state} required inputMode="numeric" maxLength={11} />
      <div className="space-y-1">
        <label htmlFor="categoryId" className="block text-sm font-semibold">Kategorija djelatnosti</label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={values.categoryId}
          aria-invalid={errors.categoryId ? true : undefined}
          aria-describedby={errors.categoryId ? "categoryId-greska" : undefined}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="">Odaberi…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <FieldError name="categoryId" message={errors.categoryId} />
      </div>
      <Field name="address" label="Adresa" state={state} required maxLength={200} />
      <Field name="city" label="Grad" state={state} required maxLength={100} />
      <Field name="phone" label="Kontakt telefon" state={state} required type="tel" maxLength={30} />
      <button
        disabled={pending}
        className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pending ? "Spremanje…" : "Pošalji na odobrenje"}
      </button>
    </form>
  );
}
