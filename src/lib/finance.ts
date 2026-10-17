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

const STORAGE_PREFIX = "mhans-finans-";
const STATE_STORAGE_KEY = `${STORAGE_PREFIX}state-v1`;
// Read the previous namespace once to preserve existing users' local records.
const LEGACY_STORAGE_PREFIX = "finova-";

function matchesStoredShape(value: unknown, fallback: unknown): boolean {
  if (value === null) return false;
  if (Array.isArray(fallback)) return Array.isArray(value);
  if (typeof fallback === "object") {
    if (!isRecord(value)) return false;
    return Object.entries(fallback ?? {}).every(([key, expected]) =>
      matchesStoredShape(value[key], expected),
    );
  }
  return typeof value === typeof fallback;
}

export function readStored<T>(key: string, fallback: T): T {
  try {
    const current = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    const serialized =
      current ?? window.localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${key}`);
    if (serialized === null) return fallback;
    const parsed: unknown = JSON.parse(serialized);
    if (!matchesStoredShape(parsed, fallback)) return fallback;
    if (current === null) {
      if (key === "workspace" && parsed === "Yılmaz Tasarım") return fallback;
      writeStored(key, parsed);
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export type FinanceBackupData = {
  transactions: Transaction[];
  accounts: BankAccount[];
  contacts: Contact[];
  dueItems: DueItem[];
  workspace: string;
  profile: { appName: string; ownerName: string };
};

export function exportBackup(data: FinanceBackupData): string {
  return JSON.stringify(
    {
      format: "mhans-finans",
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    },
    null,
    2,
  );
}

type BackupRecord = Record<string, unknown>;

function isRecord(value: unknown): value is BackupRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasStrings(record: BackupRecord, fields: string[]): boolean {
  return fields.every((field) => typeof record[field] === "string");
}

function nonblank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function validateRows(
  value: unknown,
  label: string,
  validate: (row: BackupRecord) => boolean,
): BackupRecord[] {
  if (!Array.isArray(value) || value.length > 100000) {
    throw new Error(
      `${label} listesi geçersiz veya 100.000 kayıt sınırını aşıyor.`,
    );
  }
  const ids = new Set<string>();
  for (const row of value) {
    if (
      !isRecord(row) ||
      !nonblank(row.id) ||
      ids.has(row.id) ||
      !validate(row)
    ) {
      throw new Error(
        `${label} listesinde eksik, tekrarlanan veya geçersiz bir kayıt var.`,
      );
    }
    ids.add(row.id);
  }
  return value as BackupRecord[];
}

export function parseBackup(text: string): FinanceBackupData {
  let backup: unknown;
  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error("Yedek dosyası okunamadı. Geçerli bir JSON dosyası seçin.");
  }
  if (
    !isRecord(backup) ||
    backup.format !== "mhans-finans" ||
    backup.version !== 1
  ) {
    throw new Error("Bu yedek biçimi veya sürümü desteklenmiyor.");
  }
  const data = backup.data;
  if (
    !isRecord(data) ||
    !nonblank(data.workspace) ||
    !isRecord(data.profile) ||
    !nonblank(data.profile.appName) ||
    !nonblank(data.profile.ownerName)
  ) {
    throw new Error("Yedekteki çalışma alanı veya kişisel bilgiler geçersiz.");
  }

  const accounts = validateRows(
    data.accounts,
    "Banka hesapları",
    (row) =>
      hasStrings(row, ["bank", "name", "iban", "color", "logo"]) &&
      nonblank(row.bank) &&
      nonblank(row.name) &&
      finite(row.balance),
  );
  const bankNames = new Set<string>();
  const bankKeys = new Set<string>();
  for (const account of accounts) {
    const name = account.bank as string;
    const key = name.trim().toLocaleLowerCase("tr");
    if (bankKeys.has(key)) {
      throw new Error("Yedekte aynı ada sahip birden fazla banka hesabı var.");
    }
    bankKeys.add(key);
    bankNames.add(name);
  }

  const contacts = validateRows(
    data.contacts,
    "Cari hesaplar",
    (row) =>
      hasStrings(row, [
        "name",
        "company",
        "email",
        "phone",
        "color",
        "initials",
      ]) &&
      nonblank(row.name) &&
      nonblank(row.company) &&
      finite(row.receivable) &&
      row.receivable >= 0 &&
      finite(row.payable) &&
      row.payable >= 0,
  );
  const dueItems = validateRows(
    data.dueItems,
    "Ödeme ve tahsilatlar",
    (row) =>
      hasStrings(row, ["name", "description", "icon"]) &&
      nonblank(row.name) &&
      (row.type === "income" || row.type === "expense") &&
      (row.status === "completed" || row.status === "pending") &&
      finite(row.amount) &&
      row.amount > 0 &&
      validDate(row.date),
  );
  const contactIds = new Set(contacts.map((row) => row.id));
  const dueIds = new Set(dueItems.map((row) => row.id));

  validateRows(
    data.transactions,
    "Gelir ve giderler",
    (row) =>
      hasStrings(row, ["name", "description", "category", "account", "icon"]) &&
      nonblank(row.name) &&
      nonblank(row.category) &&
      (row.type === "income" || row.type === "expense") &&
      (row.status === "completed" || row.status === "pending") &&
      finite(row.amount) &&
      row.amount > 0 &&
      validDate(row.date) &&
      bankNames.has(row.account as string) &&
      (row.dueId === undefined ||
        (nonblank(row.dueId) && dueIds.has(row.dueId))) &&
      (row.contactId === undefined ||
        (nonblank(row.contactId) && contactIds.has(row.contactId))) &&
      (row.contactAdjustment === undefined ||
        (finite(row.contactAdjustment) &&
          row.contactAdjustment >= 0 &&
          row.contactAdjustment <= row.amount)),
  );

  return data as FinanceBackupData;
}

export function readFinanceState(
  fallback: FinanceBackupData,
): FinanceBackupData {
  try {
    const snapshot = window.localStorage.getItem(STATE_STORAGE_KEY);
    if (snapshot !== null) return parseBackup(snapshot);
  } catch {
    // Recover through the original keys if a snapshot is damaged or inaccessible.
  }
  return {
    transactions: readStored("transactions", fallback.transactions),
    accounts: readStored("accounts", fallback.accounts),
    contacts: readStored("contacts", fallback.contacts),
    dueItems: readStored("due", fallback.dueItems),
    workspace: readStored("workspace", fallback.workspace),
    profile: readStored("profile", fallback.profile),
  };
}

export function persistFinanceState(data: FinanceBackupData): void {
  // One setItem commits the complete state atomically. Let callers handle quota errors.
  window.localStorage.setItem(STATE_STORAGE_KEY, exportBackup(data));
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
