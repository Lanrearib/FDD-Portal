/*
  Demo profile photos, hot-linked from Unsplash (free to use under the Unsplash
  License). These stand in for photos people would upload to their profiles.
  Anyone not listed here falls back to initials.
*/

const unsplash: Record<string, string> = {
  // Candidates
  "Tunde Bakare": "photo-1659422440915-d516c6dc932e",
  "Daniel Okoro": "photo-1614023342667-6f060e9d1e04",
  "Emeka Nwosu": "photo-1588178454780-441fa5b99fa5",
  "Kunle Ajayi": "photo-1601576084861-5de423553c0f",
  "Segun Afolabi": "photo-1595211877493-41a4e5f236b3",
  "Olumide Bankole": "photo-1596580817363-a4a8f67d4bc8",
  "Chiamaka Eze": "photo-1561406636-b80293969660",
  "Funke Adebayo": "photo-1573497491765-dccce02b29df",
  "Ifeoma Chukwu": "photo-1531123897727-8f129e1688ce",
  "Bisi Martins": "photo-1624667773099-1b80ae774080",
  "Zainab Yusuf": "photo-1592520113018-180c8bc831c9",
  // Staff
  "Sis. Ngozi Okafor": "photo-1602058746304-2aeebbef0462",
};

export function photoFor(name: string): string | undefined {
  const id = unsplash[name];
  return id ? `https://images.unsplash.com/${id}?fit=crop&crop=faces&w=256&h=256` : undefined;
}
