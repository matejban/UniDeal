import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { requireRole } from "@/lib/auth";
import { couponService, offerService } from "@/services";

// kupon koji student pokazuje partneru na mobitelu (F-020)
export default async function CouponPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("student");
  const { id } = await params;

  const coupon = await couponService.getCoupon(id);
  if (!coupon) notFound();

  // naziv ponude i partnera (samo dok je ponuda aktivna)
  const listing = await offerService.getActiveOffer(coupon.offerId);

  // QR kod kao SVG slika koja sadrži kod kupona
  const qrSvg = await QRCode.toString(coupon.code, { type: "svg", margin: 1 });

  const valid = coupon.isValid();
  let statusText = "Vrijedi";
  if (coupon.status === "iskoristen") {
    statusText = "Iskorišten";
  } else if (!valid) {
    statusText = "Istekao";
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center">
      {listing && (
        <div>
          <h1 className="text-xl font-bold">{listing.offer.title}</h1>
          <p className="text-gray-600">{listing.partner.name}</p>
          <p className="mt-1 text-2xl font-semibold text-blue-700">{listing.offer.discountLabel}</p>
        </div>
      )}

      {/* QR kod; izblijedi ako kupon više ne vrijedi */}
      <div
        className={valid ? "mx-auto mt-4 w-64" : "mx-auto mt-4 w-64 opacity-30"}
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />

      <p className="mt-4 font-mono text-3xl font-bold tracking-widest">{coupon.code}</p>
      <p className={valid ? "mt-2 font-semibold text-green-700" : "mt-2 font-semibold text-red-700"}>
        {statusText}
      </p>
      {coupon.validUntil && <p className="text-sm text-gray-500">Vrijedi do {coupon.validUntil}</p>}

      <p className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-900">
        Uz kupon partneru pokaži važeću studentsku iskaznicu (X-icu). Bez nje partner smije odbiti popust.
      </p>
    </div>
  );
}