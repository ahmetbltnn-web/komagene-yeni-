export type Transaction = {
  id: string;
  name: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  account: string;
  status: "completed" | "pending";
  icon: string;
  dueId?: string;
  contactId?: string;
  contactAdjustment?: number;
};

export type BankAccount = {
  id: string;
  bank: string;
  name: string;
  iban: string;
  balance: number;
  color: string;
  logo: string;
};

export type Contact = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  receivable: number;
  payable: number;
  color: string;
  initials: string;
};

export type DueItem = {
  id: string;
  name: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  status: "pending" | "completed";
  icon: string;
};

export const categories: string[] = [
  "Satış",
  "Hizmet",
  "Kira",
  "Yazılım",
  "Pazarlama",
  "Ofis",
  "Personel",
  "Fatura",
  "Diğer",
];

// Fictional demonstration data. Account numbers are deliberately masked.
export const seedAccounts: BankAccount[] = [
  {
    id: "garanti",
    bank: "Garanti BBVA",
    name: "Ana işletme hesabı",
    iban: "TR•• •••• •••• •••• •••• ••4821",
    balance: 148250,
    color: "#218b67",
    logo: "G",
  },
  {
    id: "isbank",
    bank: "İş Bankası",
    name: "Birikim hesabı",
    iban: "TR•• •••• •••• •••• •••• ••7613",
    balance: 92400,
    color: "#315aa7",
    logo: "İş",
  },
  {
    id: "qnb",
    bank: "QNB",
    name: "Günlük işlem hesabı",
    iban: "TR•• •••• •••• •••• •••• ••9026",
    balance: 44000,
    color: "#762c6f",
    logo: "Q",
  },
];

export const seedTransactions: Transaction[] = [
  {
    id: "previous-income",
    name: "Eylül hizmet gelirleri",
    description: "Önceki dönem örnek kapanış kaydı",
    category: "Hizmet",
    type: "income",
    amount: 106956,
    date: "2026-09-30",
    account: "Garanti BBVA",
    status: "completed",
    icon: "building-2",
  },
  {
    id: "previous-expense",
    name: "Eylül işletme giderleri",
    description: "Önceki dönem örnek kapanış kaydı",
    category: "Diğer",
    type: "expense",
    amount: 89196,
    date: "2026-09-30",
    account: "Garanti BBVA",
    status: "completed",
    icon: "receipt",
  },
  {
    id: "transaction-1",
    name: "Atlas Yazılım",
    description: "Web sitesi tasarımı · FTR-2026-084",
    category: "Hizmet",
    type: "income",
    amount: 24500,
    date: "2026-10-17",
    account: "Garanti BBVA",
    status: "completed",
    icon: "building-2",
  },
  {
    id: "transaction-2",
    name: "Ofis kirası",
    description: "Ekim ayı ofis kira ödemesi",
    category: "Kira",
    type: "expense",
    amount: 12500,
    date: "2026-10-17",
    account: "İş Bankası",
    status: "completed",
    icon: "home",
  },
  {
    id: "transaction-3",
    name: "Figma",
    description: "Professional · Aylık abonelik",
    category: "Yazılım",
    type: "expense",
    amount: 2850,
    date: "2026-10-16",
    account: "QNB",
    status: "completed",
    icon: "laptop",
  },
  {
    id: "transaction-4",
    name: "Mavi Tasarım",
    description: "Marka danışmanlığı · FTR-2026-083",
    category: "Hizmet",
    type: "income",
    amount: 38250,
    date: "2026-10-16",
    account: "Garanti BBVA",
    status: "completed",
    icon: "building-2",
  },
  {
    id: "transaction-5",
    name: "Google Ads",
    description: "Ekim reklam kampanyası",
    category: "Pazarlama",
    type: "expense",
    amount: 8200,
    date: "2026-10-15",
    account: "QNB",
    status: "completed",
    icon: "megaphone",
  },
  {
    id: "transaction-6",
    name: "Nova Teknoloji",
    description: "Ürün satışı · FTR-2026-082",
    category: "Satış",
    type: "income",
    amount: 18500,
    date: "2026-10-08",
    account: "İş Bankası",
    status: "completed",
    icon: "shopping-bag",
  },
  {
    id: "transaction-7",
    name: "Ekip maaşları",
    description: "Ekim ayı personel ödemeleri",
    category: "Personel",
    type: "expense",
    amount: 61900,
    date: "2026-10-14",
    account: "Garanti BBVA",
    status: "completed",
    icon: "users",
  },
  {
    id: "transaction-8",
    name: "Luna İletişim",
    description: "Dijital danışmanlık · FTR-2026-081",
    category: "Hizmet",
    type: "income",
    amount: 45600,
    date: "2026-10-01",
    account: "QNB",
    status: "completed",
    icon: "building-2",
  },
];

export const seedContacts: Contact[] = [
  {
    id: "contact-1",
    name: "Deniz Yılmaz",
    company: "Atlas Yazılım",
    email: "deniz@atlas.example",
    phone: "+90 5•• ••• 24 18",
    receivable: 24500,
    payable: 0,
    color: "#e4edfd",
    initials: "AY",
  },
  {
    id: "contact-2",
    name: "Ece Demir",
    company: "Mavi Tasarım",
    email: "ece@mavi.example",
    phone: "+90 5•• ••• 67 32",
    receivable: 18750,
    payable: 0,
    color: "#eae5fb",
    initials: "MT",
  },
  {
    id: "contact-3",
    name: "Berk Kaya",
    company: "Nova Teknoloji",
    email: "berk@nova.example",
    phone: "+90 5•• ••• 80 41",
    receivable: 32500,
    payable: 0,
    color: "#e3f3ed",
    initials: "NT",
  },
  {
    id: "contact-4",
    name: "Selin Aydın",
    company: "Pera Gayrimenkul",
    email: "selin@pera.example",
    phone: "+90 5•• ••• 18 09",
    receivable: 0,
    payable: 12500,
    color: "#fff0df",
    initials: "PG",
  },
  {
    id: "contact-5",
    name: "Can Arslan",
    company: "Arslan Ofis",
    email: "can@arslan.example",
    phone: "+90 5•• ••• 31 56",
    receivable: 0,
    payable: 4800,
    color: "#fbe6eb",
    initials: "AO",
  },
  {
    id: "contact-6",
    name: "İpek Şahin",
    company: "Luna İletişim",
    email: "ipek@luna.example",
    phone: "+90 5•• ••• 42 70",
    receivable: 12000,
    payable: 0,
    color: "#e1f0f4",
    initials: "Lİ",
  },
];

export const seedDueItems: DueItem[] = [
  {
    id: "due-6",
    name: "İnternet faturası",
    description: "Ekim ayı işyeri internet paketi",
    type: "expense",
    amount: 1250,
    date: "2026-10-24",
    status: "pending",
    icon: "zap",
  },
  {
    id: "due-1",
    name: "Atlas Yazılım",
    description: "Proje ödemesi · FTR-2026-085",
    type: "income",
    amount: 24500,
    date: "2026-10-18",
    status: "pending",
    icon: "building-2",
  },
  {
    id: "due-2",
    name: "Elektrik faturası",
    description: "Ekim ayı ofis elektrik gideri",
    type: "expense",
    amount: 1850,
    date: "2026-10-19",
    status: "pending",
    icon: "zap",
  },
  {
    id: "due-3",
    name: "Mavi Tasarım",
    description: "Danışmanlık hizmeti · FTR-2026-086",
    type: "income",
    amount: 18750,
    date: "2026-10-20",
    status: "pending",
    icon: "building-2",
  },
  {
    id: "due-4",
    name: "Arslan Ofis",
    description: "Çalışma ekipmanları ödemesi",
    type: "expense",
    amount: 4800,
    date: "2026-10-21",
    status: "pending",
    icon: "shopping-bag",
  },
  {
    id: "due-5",
    name: "Nova Teknoloji",
    description: "Ürün teslimatı · FTR-2026-087",
    type: "income",
    amount: 32500,
    date: "2026-10-23",
    status: "pending",
    icon: "building-2",
  },
];

export function currency(amount: number, decimals = 2): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

const STORAGE_PREFIX = "finova-";

export function readStored<T>(key: string, fallback: T): T {
  try {
    const serialized = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (serialized === null) return fallback;
    const parsed: unknown = JSON.parse(serialized);
    return parsed === null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value),
    );
  } catch {
    // A blocked or full browser store must not interrupt an active session.
  }
}
