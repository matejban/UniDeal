"use client";

import Image from "next/image";
import { useActionState } from "react";
import type { Category } from "@/repositories/CategoryRepository";
import type { OfferFormState, OfferFormValues } from "./actions";

const inputClass = "w-full rounded border border-gray-300 px-3 py-2";
const errorClass = "text-sm text-red-700";

type Props = {
  action: (prev: OfferFormState, formData: FormData) => Promise<OfferFormState>;
  values: OfferFormValues;
  categories: Category[];
  photoUrl: string | null;
  minDate: string;
  submitLabel: string;
};

export default function OfferForm({ action, values: initialValues, categories, photoUrl, minDate, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, { errors: {}, values: initialValues });
  const errors = state.errors;
  const values = state.values;

  return (
    <form action={formAction} noValidate className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {errors.form && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}

      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-semibold">Naziv ponude</label>
        <input id="title" name="title" defaultValue={values.title} maxLength={200} className={inputClass} />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-semibold">Opis</label>
        <textarea
          id="description"
          name="description"
          defaultValue={values.description}
          maxLength={2000}
          rows={4}
          className={inputClass}
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="categoryId" className="block text-sm font-semibold">Kategorija</label>
        <select id="categoryId" name="categoryId" defaultValue={values.categoryId} className={inputClass}>
          <option value="">Odaberi kategoriju</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className={errorClass}>{errors.categoryId}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="discountType" className="block text-sm font-semibold">Vrsta popusta</label>
          <select id="discountType" name="discountType" defaultValue={values.discountType} className={inputClass}>
            <option value="postotak">Postotak (%)</option>
            <option value="iznos">Iznos (€)</option>
          </select>
          {errors.discountType && <p className={errorClass}>{errors.discountType}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="discountValue" className="block text-sm font-semibold">Popust</label>
          <input
            id="discountValue"
            name="discountValue"
            inputMode="decimal"
            defaultValue={values.discountValue}
            placeholder="npr. 20 ili 5,50"
            className={inputClass}
          />
          {errors.discountValue && <p className={errorClass}>{errors.discountValue}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="validUntil" className="block text-sm font-semibold">Vrijedi do</label>
        <input
          id="validUntil"
          name="validUntil"
          type="date"
          min={minDate}
          defaultValue={values.validUntil}
          className={inputClass}
        />
        {errors.validUntil && <p className={errorClass}>{errors.validUntil}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="conditions" className="block text-sm font-semibold">Uvjeti korištenja</label>
        <textarea
          id="conditions"
          name="conditions"
          defaultValue={values.conditions}
          maxLength={1000}
          rows={3}
          placeholder="npr. uz predočenje x-ice, ne vrijedi vikendom"
          className={inputClass}
        />
        {errors.conditions && <p className={errorClass}>{errors.conditions}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="usageLimit" className="block text-sm font-semibold">Korištenje</label>
        <select id="usageLimit" name="usageLimit" defaultValue={values.usageLimit} className={inputClass}>
          <option value="neograniceno">Neograničeno</option>
          <option value="jednom_po_studentu">Jednom po studentu</option>
        </select>
        {errors.usageLimit && <p className={errorClass}>{errors.usageLimit}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="photo" className="block text-sm font-semibold">Fotografija</label>
        {photoUrl && (
          <Image
            src={photoUrl}
            alt="Trenutačna fotografija ponude"
            width={192}
            height={128}
            className="h-32 w-48 rounded border border-gray-200 object-cover"
          />
        )}
        <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
        <p className="text-xs text-gray-500">
          JPG, PNG ili WebP, najviše 2 MB.{photoUrl && " Nova fotografija zamjenjuje trenutačnu."}
        </p>
        {errors.photo && <p className={errorClass}>{errors.photo}</p>}
      </div>

      <button
        disabled={pending}
        className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pending ? "Spremanje…" : submitLabel}
      </button>
    </form>
  );
}
