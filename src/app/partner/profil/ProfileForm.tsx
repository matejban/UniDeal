"use client";

import { useActionState } from "react";
import type { PartnerProfile } from "@/repositories/PartnerRepository";
import { updateProfile, type ProfileState } from "./actions";

const inputClass = "w-full rounded border border-gray-300 px-3 py-2";
const errorClass = "text-sm text-red-700";

export default function ProfileForm({ profile }: { profile: PartnerProfile }) {
  // Obrazac na početku prikazuje trenutačne podatke iz baze.
  const initialState: ProfileState = { errors: {}, values: profile, saved: false };
  const [state, action, pending] = useActionState(updateProfile, initialState);
  const errors = state.errors;
  const values = state.values;

  return (
    <form action={action} noValidate className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {state.saved && <p className="rounded bg-green-50 p-3 text-sm text-green-800">Profil je spremljen.</p>}
      {errors.form && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-semibold">Naziv poslovnog subjekta</label>
        <input id="name" name="name" defaultValue={values.name} maxLength={200} className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
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

      <div className="space-y-1">
        <label htmlFor="hours" className="block text-sm font-semibold">Radno vrijeme</label>
        <input
          id="hours"
          name="hours"
          defaultValue={values.hours}
          maxLength={200}
          placeholder="npr. pon–pet 8–20, sub 9–14"
          className={inputClass}
        />
        {errors.hours && <p className={errorClass}>{errors.hours}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-semibold">Opis</label>
        <textarea
          id="description"
          name="description"
          defaultValue={values.description}
          maxLength={1000}
          rows={5}
          className={inputClass}
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      <button
        disabled={pending}
        className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pending ? "Spremanje…" : "Spremi profil"}
      </button>
    </form>
  );
}
