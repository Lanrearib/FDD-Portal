/*
  Demo profile photos, hot-linked from Unsplash (free to use under the Unsplash
  License). They stand in for photos people would upload to their own profiles.
  Every named person has a photo; anyone not listed (for example a counsellor added
  by bulk upload) gets a consistent photo from a pool chosen by title and first name.
*/

const named: Record<string, string> = {
  // Candidates
  "Tunde Bakare": "1659422440915-d516c6dc932e",
  "Daniel Okoro": "1614023342667-6f060e9d1e04",
  "Emeka Nwosu": "1588178454780-441fa5b99fa5",
  "Kunle Ajayi": "1601576084861-5de423553c0f",
  "Segun Afolabi": "1595211877493-41a4e5f236b3",
  "Olumide Bankole": "1596580817363-a4a8f67d4bc8",
  "Femi Adeola": "1565884280295-98eb83e41c65",
  "Chiamaka Eze": "1561406636-b80293969660",
  "Funke Adebayo": "1573497491765-dccce02b29df",
  "Ifeoma Chukwu": "1531123897727-8f129e1688ce",
  "Bisi Martins": "1624667773099-1b80ae774080",
  "Zainab Yusuf": "1592520113018-180c8bc831c9",
  "Ibrahim D.": "1605980776566-0486c3ac7617",
  "Chidi O.": "1659422440143-9329dd06298c",
  "Tobi Alade": "1542276677-0aab41a6190f",
  "Kemi Ojo": "1769636929388-99eff95d3bf1",
  "Esi Mensah": "1593351799227-75df2026356b",
  "Yaw Owusu": "1610903866883-c280999dcc0e",
  "Fola Bello": "1583123810408-23e7b5d1af9f",
  "Chinonso Eze": "1613730317928-246094cb6a82",
  // Support requests
  "Chinedu and Amaka Okeke": "1769636930016-5d9f0ca653aa",
  "Mrs. Rita Nwachukwu": "1678225894316-b6e83cd06242",
  "Seun and Folake Ade": "1769636929130-56648d6e9c6d",
  "Bro. Kola Peters": "1590697442615-a381b5b557c7",
  // Counsellors and leadership
  "Sis. Ngozi Okafor": "1602058746304-2aeebbef0462",
  "Pastor Mrs. Funmi Adeyemi": "1678225892094-97b21e4fb8f1",
  "Bro. Femi Ogun": "1654125992479-37dc114b3a5c",
  "Sis. Ada Nnaji": "1769636930152-238ed1f7e07f",
  "Bro. Sani Ibrahim": "1645736593932-2c877741fd6c",
  "Sis. Akosua Boateng": "1645736353780-e70a7d508088",
  "Bro. Paul Mbarga": "1724128191061-c89bcd6e6146",
  "Bro. Kwesi Appiah": "1642736468842-c6bdcfbbcd28",
  "Sis. Halima Bello": "1505421031134-e57263cae630",
  "Pastor Gbenga Oyelaran": "1642257859842-c95f9fa8121d",
  // Pastor directory
  "Pastor Samuel Adeyemi": "1714118657863-2843a622718b",
  "Pastor Grace Bello": "1625954265701-b73c91eb2330",
  "Pastor John Ojo": "1604077323808-bad00ee896dd",
  "Pastor Michael Ade": "1724128195247-ab10e4535b53",
  "Pastor Daniel Oke": "1578758803946-2c4f6738df87",
  "Pastor Tolu Coker": "1637684666772-1f215bfd0f5d",
  "Pastor Chidi Eze": "1588560979004-a4de3190506e",
  "Pastor Kemi Lawal": "1748290880596-2a2c80530bc0",
  "Pastor Femi Oni": "1614705660975-ce6ba7d731c7",
  "Pastor Ibrahim Musa": "1659093728055-45f8275166d9",
  "Pastor Joy Okafor": "1573497161161-c3e73707e25c",
  "Pastor Paul Danjuma": "1626639900752-3ea9001925ae",
  "Pastor Kwame Mensah": "1748180799911-05ff4dba03ea",
  "Pastor Abena Owusu": "1530785602389-07594beb8b73",
  "Pastor Kofi Asante": "1596604820148-da737958af16",
  "Pastor Jean Ndongo": "1595743826997-87eb67a31872",
  "Pastor Marie Ekane": "1763757321139-e7e4de128cd9",
};

const womenPool = [
  "1769636929266-8057f2c5ed52",
  "1652471949169-9c587e8898cd",
  "1511935039706-c2b225e45a44",
  "1668784205144-70b34da968ae",
  "1609436132311-e4b0c9370469",
];
const menPool = [
  "1564541558234-ef406c118d0c",
  "1642736468880-b6adf66bdd50",
  "1655313836628-af779ac11e14",
  "1601651583954-1e1595117de1",
  "1732888646671-7ceaf1155bea",
];

const womenNames = new Set(
  "grace kemi joy abena marie funmi ada akosua halima chiamaka funke ifeoma bisi zainab esi chinonso rita folake amaka ngozi adaeze esther mary ruth blessing chioma ngozi aisha fatima titi bola yemi sade".split(" "),
);

function looksFemale(name: string) {
  if (/^(Sis\.|Mrs\.|Ms\.|Miss)\s/i.test(name) || /\bMrs\.\s/.test(name)) return true;
  const first = name.replace(/^(Pastor|Bro\.|Sis\.|Dr\.|Mrs\.|Mr\.)\s+/i, "").split(/\s+/)[0]?.toLowerCase() ?? "";
  return womenNames.has(first);
}

function hash(s: string) {
  return [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
}

/** Every name resolves to a photo; listed people get their own, others a consistent one from the pool. */
export function photoFor(name: string): string {
  const id = named[name] ?? (looksFemale(name) ? womenPool : menPool)[hash(name) % 5];
  return `https://images.unsplash.com/photo-${id}?fit=crop&crop=faces&w=256&h=256`;
}
