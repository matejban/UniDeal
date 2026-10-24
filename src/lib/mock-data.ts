// Lažni podaci dok shema baze (Supabase) ne bude gotova.

export type Partner = {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
};

export type Offer = {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  category: string;
  discount: string;
  validUntil: string;
  conditions: string;
  status: "nacrt" | "aktivna" | "istekla";
};

export const categories = ["Hrana", "Zdravlje i sport", "Obrazovanje", "Zabava"];

export const partners: Partner[] = [
  {
    id: "kafic-kampus",
    name: "Kafić Kampus",
    category: "Hrana",
    city: "Zagreb",
    address: "Unska ulica 3, Zagreb",
    phone: "01 111 2222",
    hours: "Pon–Pet 7–22, Sub 8–14",
    description: "Kafić uz kampus s doručkom i kavom za van.",
  },
  {
    id: "fit-zona",
    name: "Fit Zona",
    category: "Zdravlje i sport",
    city: "Zagreb",
    address: "Savska cesta 25, Zagreb",
    phone: "01 333 4444",
    hours: "Svaki dan 6–23",
    description: "Teretana s grupnim treninzima.",
  },
  {
    id: "knjizara-index",
    name: "Knjižara Index",
    category: "Obrazovanje",
    city: "Split",
    address: "Ruđera Boškovića 31, Split",
    phone: "021 555 666",
    hours: "Pon–Sub 9–20",
    description: "Udžbenici, skripte i školski pribor.",
  },
];

export const offers: Offer[] = [
  {
    id: "1",
    partnerId: "kafic-kampus",
    title: "Kava + kroasan",
    description: "Kava po izboru i kroasan po studentskoj cijeni.",
    category: "Hrana",
    discount: "30 %",
    validUntil: "2026-12-31",
    conditions: "Samo radnim danom do 11 h.",
    status: "aktivna",
  },
  {
    id: "2",
    partnerId: "fit-zona",
    title: "Mjesečna članarina",
    description: "Neograničen pristup teretani i grupnim treninzima.",
    category: "Zdravlje i sport",
    discount: "10 €",
    validUntil: "2026-11-30",
    conditions: "Jednom po studentu.",
    status: "aktivna",
  },
  {
    id: "3",
    partnerId: "knjizara-index",
    title: "Popust na udžbenike",
    description: "Popust na sve udžbenike i skripte.",
    category: "Obrazovanje",
    discount: "15 %",
    validUntil: "2027-01-31",
    conditions: "Ne vrijedi uz druge akcije.",
    status: "aktivna",
  },
  {
    id: "4",
    partnerId: "kafic-kampus",
    title: "Ručak dana",
    description: "Dnevni meni s juhom i desertom.",
    category: "Hrana",
    discount: "20 %",
    validUntil: "2026-12-15",
    conditions: "Pon–Pet 12–15 h.",
    status: "nacrt",
  },
];

export const activeOffers = offers.filter((o) => o.status === "aktivna");

export function getPartner(id: string) {
  return partners.find((p) => p.id === id);
}
