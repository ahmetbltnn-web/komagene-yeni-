import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  Ellipsis,
  FileText,
  Grid2X2,
  Home,
  Laptop,
  LogOut,
  Menu,
  Megaphone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { CashFlowChart, ExpenseDonut } from "./components/Charts";
import {
  categories,
  currency,
  readStored,
  seedAccounts,
  seedContacts,
  seedDueItems,
  seedTransactions,
  writeStored,
  type BankAccount,
  type Contact,
  type DueItem,
  type Transaction,
} from "./lib/finance";

type Page =
  | "overview"
  | "transactions"
  | "accounts"
  | "contacts"
  | "schedule"
  | "reports";
type Modal =
  | "transaction"
  | "account"
  | "contact"
  | "due"
  | "settings"
  | "help"
  | "pro"
  | null;
type Period = "week" | "month" | "year";
const navigation = [
  { id: "overview", label: "Genel Bakış", icon: Grid2X2 },
  { id: "transactions", label: "İşlemler", icon: ArrowDownLeft },
  { id: "accounts", label: "Banka Hesapları", icon: Wallet },
  { id: "contacts", label: "Cari Hesaplar", icon: Users },
  { id: "schedule", label: "Ödemeler & Tahsilatlar", icon: CalendarDays },
  { id: "reports", label: "Raporlar", icon: BarChart3 },
] as const;
const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];
const colorPalette = [
  "#12a88b",
  "#8a80d6",
  "#f3b477",
  "#7da5df",
  "#e8bece",
  "#a1b4bc",
  "#e2cc80",
];
const iconMap: Record<string, typeof Wallet> = {
  "building-2": Building2,
  laptop: Laptop,
  home: Home,
  "shopping-bag": ShoppingBag,
  megaphone: Megaphone,
  zap: Zap,
  users: Users,
  wallet: Wallet,
  receipt: FileText,
  "credit-card": CreditCard,
};
const dateText = (date: string, year = false) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    ...(year ? { year: "numeric" } : {}),
  });
const sum = <T,>(items: T[], fn: (item: T) => number) =>
  items.reduce((total, item) => total + fn(item), 0);
const newId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <span className="brand-symbol">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span>
          finova<span className="brand-dot">.</span>
        </span>
      )}
    </div>
  );
}

function Money({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const formatted = currency(value, decimals);
  const [whole, cents] = formatted.split(",");
  return (
    <span className="money">
      {whole}
      {cents && <span className="money-cents">,{cents}</span>}
    </span>
  );
}

function TransactionIcon({ icon, type }: { icon: string; type: string }) {
  const Icon = iconMap[icon] || Wallet;
  return (
    <span className={`transaction-icon ${type}`}>
      <Icon size={18} strokeWidth={1.8} />
    </span>
  );
}

function EmptyState({
  title = "Henüz bir kayıt yok",
  description = "Yeni bir kayıt ekleyerek finansınızı takip etmeye başlayın.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <FileText size={27} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    readStored("transactions", seedTransactions),
  );
  const [accounts, setAccounts] = useState<BankAccount[]>(() =>
    readStored("accounts", seedAccounts),
  );
  const [contacts, setContacts] = useState<Contact[]>(() =>
    readStored("contacts", seedContacts),
  );
  const [dueItems, setDueItems] = useState<DueItem[]>(() =>
    readStored("due", seedDueItems),
  );
  const [workspace, setWorkspace] = useState(() =>
    readStored("workspace", "Yılmaz Tasarım"),
  );
  const [modal, setModal] = useState<Modal>(null);
  const [detail, setDetail] = useState<
    Transaction | Contact | BankAccount | null
  >(null);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState(10);
  const [period, setPeriod] = useState<Period>("month");
  const [dueTab, setDueTab] = useState<"expense" | "income">("expense");
  const [type, setType] = useState<"income" | "expense">("income");
  const [formError, setFormError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    writeStored("transactions", transactions);
  }, [transactions]);
  useEffect(() => {
    writeStored("accounts", accounts);
  }, [accounts]);
  useEffect(() => {
    writeStored("contacts", contacts);
  }, [contacts]);
  useEffect(() => {
    writeStored("due", dueItems);
  }, [dueItems]);
  useEffect(() => {
    writeStored("workspace", workspace);
  }, [workspace]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setModal(null);
        setDetail(null);
        setSearchOpen(false);
        setNotificationsOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!modal && !detail) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(
      () =>
        modalRef.current
          ?.querySelector<HTMLElement>('input, button, select, [tabindex="0"]')
          ?.focus(),
      50,
    );
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !modalRef.current) return;
      const elements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex="0"]',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [modal, detail]);

  const navigate = (next: Page) => {
    setPage(next);
    setFilter("all");
    setCategory("all");
    setQuery("");
    setMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openModal = (next: Modal) => {
    setFormError("");
    setModal(next);
    setType("income");
  };
  const monthTransactions = transactions.filter(
    (t) => Number(t.date.slice(5, 7)) === month && t.date.startsWith("2026"),
  );
  const completed = monthTransactions.filter((t) => t.status === "completed");
  const income = sum(
    completed.filter((t) => t.type === "income"),
    (t) => t.amount,
  );
  const expense = sum(
    completed.filter((t) => t.type === "expense"),
    (t) => t.amount,
  );
  const previousMonth = transactions.filter(
    (t) =>
      t.status === "completed" &&
      t.date.startsWith("2026") &&
      Number(t.date.slice(5, 7)) === month - 1,
  );
  const previousIncome = sum(
    previousMonth.filter((t) => t.type === "income"),
    (t) => t.amount,
  );
  const previousExpense = sum(
    previousMonth.filter((t) => t.type === "expense"),
    (t) => t.amount,
  );
  const change = (current: number, previous: number) =>
    previous
      ? `${current >= previous ? "+" : "−"}%${(Math.abs((current - previous) / previous) * 100).toFixed(1).replace(".", ",")}`
      : "—";
  const comparisonLabel = previousMonth.length
    ? "geçen aya göre"
    : "önceki dönem yok";
  const balance = sum(accounts, (a) => a.balance);
  const pending = dueItems
    .filter((d) => d.status === "pending")
    .sort((a, b) => a.date.localeCompare(b.date));
  const pendingExpense = sum(
    pending.filter((d) => d.type === "expense"),
    (d) => d.amount,
  );
  const pendingIncome = sum(
    pending.filter((d) => d.type === "income"),
    (d) => d.amount,
  );
  const expenseCategories = Object.entries(
    completed
      .filter((t) => t.type === "expense")
      .reduce<
        Record<string, number>
      >((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([label, amount], i) => ({
      label,
      amount,
      color: colorPalette[i % colorPalette.length],
    }));
  const filteredTransactions = monthTransactions
    .filter(
      (t) =>
        (filter === "all" || t.type === filter) &&
        (category === "all" || t.category === category) &&
        `${t.name} ${t.description} ${t.category} ${t.account}`
          .toLocaleLowerCase("tr")
          .includes(query.toLocaleLowerCase("tr")),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const matchedTransactions = query.trim()
    ? transactions
        .filter((t) =>
          `${t.name} ${t.description} ${t.category}`
            .toLocaleLowerCase("tr")
            .includes(query.toLocaleLowerCase("tr")),
        )
        .slice(0, 4)
    : [];

  function applyBalance(account: string, amount: number) {
    setAccounts((current) =>
      current.map((a) =>
        a.bank === account ? { ...a, balance: a.balance + amount } : a,
      ),
    );
  }

  function saveTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Lütfen sıfırdan büyük, geçerli bir tutar girin.");
      return;
    }
    const account = String(data.get("account"));
    if (!accounts.some((a) => a.bank === account)) {
      setFormError("İşlem için bir banka hesabı seçin.");
      return;
    }
    const item: Transaction = {
      id: newId(),
      name: String(data.get("name")).trim(),
      description: String(data.get("description")).trim(),
      category: String(data.get("category")),
      type,
      amount,
      date: String(data.get("date")),
      account,
      status: "completed",
      icon: type === "income" ? "building-2" : "receipt",
    };
    setTransactions((current) => [item, ...current]);
    applyBalance(item.account, amount * (type === "income" ? 1 : -1));
    setMonth(Number(item.date.slice(5, 7)));
    setModal(null);
    setToast(
      `${type === "income" ? "Gelir" : "Gider"} kaydı eklendi. Hesap bakiyeniz güncellendi.`,
    );
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const bank = String(data.get("bank")).trim();
    if (
      accounts.some(
        (a) => a.bank.toLocaleLowerCase("tr") === bank.toLocaleLowerCase("tr"),
      )
    ) {
      setFormError("Bu banka zaten kayıtlı. Başka bir hesap adı kullanın.");
      return;
    }
    setAccounts((current) => [
      ...current,
      {
        id: newId(),
        bank,
        name: String(data.get("name")).trim(),
        iban: String(data.get("iban")).trim() || "IBAN belirtilmedi",
        balance: Number(data.get("balance")),
        color: colorPalette[current.length % colorPalette.length],
        logo: bank.slice(0, 2).toUpperCase(),
      },
    ]);
    setModal(null);
    setToast("Banka hesabınız eklendi.");
  }

  function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company")).trim();
    setContacts((current) => [
      ...current,
      {
        id: newId(),
        name: String(data.get("name")).trim(),
        company,
        email: String(data.get("email")),
        phone: String(data.get("phone")),
        receivable: Number(data.get("receivable")),
        payable: Number(data.get("payable")),
        color: "#e4f2ed",
        initials: company
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
      },
    ]);
    setModal(null);
    setToast("Cari hesap oluşturuldu.");
  }

  function saveDue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Lütfen geçerli bir tutar girin.");
      return;
    }
    setDueItems((current) => [
      ...current,
      {
        id: newId(),
        name: String(data.get("name")).trim(),
        description: String(data.get("description")),
        type,
        amount,
        date: String(data.get("date")),
        status: "pending",
        icon: type === "income" ? "building-2" : "receipt",
      },
    ]);
    setModal(null);
    setToast("İşlem ödeme takviminize eklendi.");
  }

  function completeDue(item: DueItem) {
    if (item.status === "completed") return;
    const contact = contacts.find((c) => c.company === item.name);
    const balanceField = item.type === "income" ? "receivable" : "payable";
    const contactAdjustment = contact
      ? Math.min(contact[balanceField], item.amount)
      : 0;
    setDueItems((current) =>
      current.map((d) =>
        d.id === item.id ? { ...d, status: "completed" } : d,
      ),
    );
    const transaction: Transaction = {
      ...item,
      id: newId(),
      date: "2026-10-17",
      status: "completed",
      category: item.type === "income" ? "Hizmet" : "Fatura",
      account: accounts[0]?.bank || "",
      description: item.description,
      dueId: item.id,
      contactId: contact?.id,
      contactAdjustment,
    };
    setTransactions((current) => [transaction, ...current]);
    applyBalance(
      transaction.account,
      item.amount * (item.type === "income" ? 1 : -1),
    );
    setContacts((current) =>
      current.map((c) =>
        c.id === contact?.id
          ? { ...c, [balanceField]: c[balanceField] - contactAdjustment }
          : c,
      ),
    );
    setToast(
      item.type === "income"
        ? "Tahsilat tamamlandı ve hesabınıza işlendi."
        : "Ödeme tamamlandı ve hesabınızdan düşüldü.",
    );
  }

  function deleteTransaction(item: Transaction) {
    setTransactions((current) => current.filter((t) => t.id !== item.id));
    if (item.status === "completed")
      applyBalance(
        item.account,
        item.amount * (item.type === "income" ? -1 : 1),
      );
    if (item.dueId) {
      setDueItems((current) =>
        current.map((d) =>
          d.id === item.dueId ? { ...d, status: "pending" } : d,
        ),
      );
      const field = item.type === "income" ? "receivable" : "payable";
      setContacts((current) =>
        current.map((c) =>
          c.id === item.contactId
            ? { ...c, [field]: c[field] + (item.contactAdjustment || 0) }
            : c,
        ),
      );
    }
    setDetail(null);
    setToast("İşlem silindi ve hesap bakiyesi güncellendi.");
  }

  function exportReport() {
    const rows = [
      [
        "Tarih",
        "İşlem",
        "Açıklama",
        "Tür",
        "Kategori",
        "Tutar (TRY)",
        "Banka",
        "Durum",
      ],
      ...filteredTransactions.map((t) => [
        t.date,
        t.name,
        t.description,
        t.type === "income" ? "Gelir" : "Gider",
        t.category,
        t.amount.toFixed(2).replace(".", ","),
        t.account,
        t.status === "completed" ? "Tamamlandı" : "Bekliyor",
      ]),
    ];
    const csv =
      "\uFEFF" +
      rows
        .map((row) =>
          row
            .map((value) => {
              const safe = /^[=+@\-\t\r]/.test(String(value))
                ? `'${value}`
                : String(value);
              return `"${safe.replace(/"/g, '""')}"`;
            })
            .join(";"),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `Finova-${monthNames[month - 1]}-2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast(`${monthNames[month - 1]} ayı raporunuz CSV olarak indirildi.`);
  }

  function TransactionTable({ compact = false }: { compact?: boolean }) {
    const items = compact
      ? [...monthTransactions]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5)
      : filteredTransactions;
    return (
      <div className="table-scroll">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>İşlem</th>
              <th>Kategori</th>
              <th>Tarih</th>
              <th className="align-right">Tutar</th>
              {!compact && <th>Durum</th>}
              <th className="action-cell">
                <span className="sr-only">Detay</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => setDetail(item)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setDetail(item)}
                aria-label={`${item.name}, ${currency(item.amount)}`}
              >
                <td>
                  <div className="transaction-name">
                    <TransactionIcon icon={item.icon} type={item.type} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{compact ? item.account : item.description}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`category-badge category-${item.category}`}>
                    {item.category}
                  </span>
                </td>
                <td className="date-cell">
                  {dateText(item.date)}
                  <span className="year"> 2026</span>
                </td>
                <td className={`amount ${item.type} align-right`}>
                  {item.type === "income" ? "+" : "−"}
                  {currency(item.amount)}
                </td>
                {!compact && (
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      ●{" "}
                      {item.status === "completed" ? "Tamamlandı" : "Bekliyor"}
                    </span>
                  </td>
                )}
                <td className="action-cell">
                  <button
                    className="icon-button subtle"
                    aria-label={`${item.name} işlem detayları`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetail(item);
                    }}
                  >
                    <Ellipsis size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && (
          <EmptyState
            title="İşlem bulunamadı"
            description="Seçili dönemi veya arama filtrelerinizi değiştirebilirsiniz."
          />
        )}
      </div>
    );
  }

  function StatCard({
    label,
    value,
    icon,
    color,
    trend,
    trendLabel,
    points,
    neutral = false,
  }: {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    trend: string;
    trendLabel: string;
    points: string;
    neutral?: boolean;
  }) {
    return (
      <article className="stat-card">
        <div className="stat-top">
          <span className={`stat-icon ${color}`}>{icon}</span>
          <span className="stat-label">{label}</span>
          <span className="stat-top-mark">
            <Ellipsis size={17} />
          </span>
        </div>
        <div className="stat-value">
          <Money value={value} />
        </div>
        <div className="stat-bottom">
          <span className={`stat-trend ${color === "orange" ? "down" : ""}`}>
            {!neutral &&
              (trend.startsWith("−") ? (
                <ArrowDownRight size={12} />
              ) : (
                <ArrowUpRight size={12} />
              ))}
            {trend}
          </span>
          <span className="trend-label">{trendLabel}</span>
          <svg
            className={`sparkline ${color}`}
            viewBox="0 0 88 28"
            aria-hidden="true"
          >
            <path
              d={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>
    );
  }

  function Stats() {
    return (
      <div className="stats-grid">
        <StatCard
          label="Toplam Bakiye"
          value={balance}
          icon={<Wallet size={19} />}
          color="green"
          trend={`${accounts.length} hesap`}
          trendLabel="bir arada"
          neutral
          points="M1 23 L10 19 L18 21 L26 15 L34 17 L42 12 L50 15 L59 8 L68 10 L77 4 L87 5"
        />
        <StatCard
          label="Toplam Gelir"
          value={income}
          icon={<ArrowDownLeft size={20} />}
          color="blue"
          trend={change(income, previousIncome)}
          trendLabel={comparisonLabel}
          points="M1 24 L10 20 L18 22 L26 14 L34 16 L42 9 L50 13 L59 7 L68 9 L77 3 L87 4"
        />
        <StatCard
          label="Toplam Gider"
          value={expense}
          icon={<ArrowUpRight size={20} />}
          color="orange"
          trend={change(expense, previousExpense)}
          trendLabel={comparisonLabel}
          points="M1 6 L10 11 L18 8 L26 15 L34 12 L42 17 L50 14 L59 21 L68 17 L77 23 L87 21"
        />
        <StatCard
          label="Net Kâr"
          value={income - expense}
          icon={<TrendingUp size={19} />}
          color="purple"
          trend={change(income - expense, previousIncome - previousExpense)}
          trendLabel={comparisonLabel}
          points="M1 24 L10 22 L18 25 L26 19 L34 20 L42 13 L50 15 L59 9 L68 12 L77 5 L87 3"
        />
      </div>
    );
  }

  function CashFlowCard() {
    return (
      <section className="card cash-flow-card">
        <div className="card-heading">
          <div>
            <h2>Nakit Akışı</h2>
            <p>Gelir ve giderlerinizin genel görünümü</p>
          </div>
          <div className="segmented small">
            {(["week", "month", "year"] as const).map((p, i) => (
              <button
                key={p}
                className={period === p ? "active" : ""}
                onClick={() => setPeriod(p)}
              >
                {["Haftalık", "Aylık", "Yıllık"][i]}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-legend">
          <span>
            <i className="legend-dot green" />
            Gelir
          </span>
          <span>
            <i className="legend-dot peach" />
            Gider
          </span>
          <span className="chart-unit">Tutar (₺)</span>
        </div>
        <CashFlowChart
          period={period}
          transactions={transactions}
          month={month}
        />
      </section>
    );
  }

  function ExpenseCard() {
    return (
      <section className="card expense-card">
        <div className="card-heading">
          <div>
            <h2>Gider Dağılımı</h2>
            <p>Harcamalarınızın kategori bazında dağılımı</p>
          </div>
          <span className="quiet-icon">
            <Ellipsis size={20} />
          </span>
        </div>
        <div className="donut-content">
          <ExpenseDonut items={expenseCategories} />
          <div className="donut-legend">
            {expenseCategories.slice(0, 5).map((item) => (
              <div className="donut-legend-row" key={item.label}>
                <span
                  className="legend-dot"
                  style={{ background: item.color }}
                />
                <span>{item.label}</span>
                <strong>%{Math.round((item.amount / expense) * 100)}</strong>
              </div>
            ))}
            {!expenseCategories.length && <p>Bu dönemde gider kaydı yok.</p>}
          </div>
        </div>
        <div className="expense-bottom">
          <span>
            <span className="tiny-dot" />
            {monthNames[month - 1]} 2026
          </span>
          <span>
            {completed.filter((t) => t.type === "expense").length} gider işlemi
          </span>
        </div>
      </section>
    );
  }

  function UpcomingCard() {
    const items = pending.filter((d) => d.type === dueTab);
    return (
      <section className="card upcoming-card">
        <div className="card-heading">
          <div>
            <h2>Yaklaşan İşlemler</h2>
            <p>Takviminizde neler var?</p>
          </div>
          <button
            className="icon-button subtle"
            onClick={() => navigate("schedule")}
            aria-label="Ödeme takvimini aç"
          >
            <ArrowUpRight size={19} />
          </button>
        </div>
        <div className="upcoming-tabs">
          <button
            className={dueTab === "expense" ? "active" : ""}
            onClick={() => setDueTab("expense")}
          >
            Ödemeler{" "}
            <span>{pending.filter((d) => d.type === "expense").length}</span>
          </button>
          <button
            className={dueTab === "income" ? "active" : ""}
            onClick={() => setDueTab("income")}
          >
            Tahsilatlar{" "}
            <span>{pending.filter((d) => d.type === "income").length}</span>
          </button>
        </div>
        <div className="upcoming-list">
          {items.slice(0, 3).map((item) => (
            <button
              className="upcoming-item"
              key={item.id}
              onClick={() => {
                navigate("schedule");
                setFilter(item.type);
              }}
            >
              <span className="date-block">
                <b>{item.date.slice(-2)}</b>
                <span>
                  {monthNames[Number(item.date.slice(5, 7)) - 1]
                    .slice(0, 3)
                    .toLocaleUpperCase("tr")}
                </span>
              </span>
              <span className="upcoming-info">
                <strong>{item.name}</strong>
                <span>
                  {item.type === "income"
                    ? "Beklenen tahsilat"
                    : "Planlı ödeme"}
                </span>
              </span>
              <span className="upcoming-amount">
                {currency(item.amount, 0)}
                <span>{dateText(item.date)}</span>
              </span>
            </button>
          ))}
          {!items.length && (
            <EmptyState
              title="Takviminiz boş"
              description="Bekleyen işleminiz bulunmuyor."
            />
          )}
        </div>
        <div className="upcoming-note">
          <Clock3 size={14} />
          <span>
            Bu ay <strong>{pending.length} işleminiz</strong> sizi bekliyor.
          </span>
          <ArrowRight size={14} />
        </div>
      </section>
    );
  }

  function AccountCard({ account }: { account: BankAccount }) {
    return (
      <button className="bank-card" onClick={() => setDetail(account)}>
        <div className="bank-card-top">
          <span
            className="bank-logo"
            style={{ color: account.color, background: `${account.color}10` }}
          >
            {account.logo}
          </span>
          <div>
            <strong>{account.bank}</strong>
            <span>{account.name}</span>
          </div>
          <Ellipsis size={19} />
        </div>
        <span className="bank-balance-label">Kullanılabilir bakiye</span>
        <div className="bank-balance">
          <Money value={account.balance} />
          <span className="currency-pill">TRY</span>
        </div>
        <div className="bank-card-bottom">
          <span>{account.iban}</span>
          <span className="bank-connected">
            <i />
            Aktif
          </span>
        </div>
      </button>
    );
  }

  const titles: Record<Page, [string, string]> = {
    overview: [
      "Finansınıza bir bakış",
      "İşletmenizin finansal sağlığını tek ekrandan takip edin.",
    ],
    transactions: [
      "Tüm işlemleriniz, tek yerde",
      "Gelir ve giderlerinizi yönetin, finansal hareketlerinizi takip edin.",
    ],
    accounts: [
      "Banka hesaplarınız",
      "Tüm hesaplarınızı ve kullanılabilir bakiyelerinizi bir arada görün.",
    ],
    contacts: [
      "Cari hesaplarınız",
      "Müşteri ve tedarikçi ilişkilerinizi, alacak ve borçlarınızı yönetin.",
    ],
    schedule: [
      "Ödeme & tahsilat takvimi",
      "Yaklaşan işlemleri planlayın, nakit akışınızı kontrol altında tutun.",
    ],
    reports: [
      "Rakamlarınızın anlattığı",
      "Finansal performansınızı keşfedin, daha bilinçli kararlar alın.",
    ],
  };
  const pageAction =
    page === "accounts"
      ? "Hesap ekle"
      : page === "contacts"
        ? "Cari hesap ekle"
        : page === "schedule"
          ? "İşlem planla"
          : page === "reports"
            ? "Raporu indir"
            : "İşlem ekle";

  return (
    <div className="app-shell">
      {menuOpen && (
        <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />
      )}
      <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}>
        <button
          className="brand-button"
          onClick={() => navigate("overview")}
          aria-label="Finova ana sayfa"
        >
          <Logo />
        </button>
        <button
          className="workspace-switch"
          onClick={() => openModal("settings")}
        >
          <span className="workspace-avatar">
            Y<span />
          </span>
          <span>
            <strong>{workspace}</strong>
            <small>İşletme hesabı</small>
          </span>
          <ChevronDown size={14} />
        </button>
        <div className="nav-label">ÇALIŞMA ALANI</div>
        <nav aria-label="Ana menü">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <item.icon size={19} strokeWidth={1.7} />
              <span>{item.label}</span>
              {item.id === "schedule" && (
                <span className="nav-count">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="pro-card">
            <span className="pro-icon">
              <Sparkles size={19} />
            </span>
            <h3>Bir adım öne geçin.</h3>
            <p>
              Daha güçlü raporlar, daha
              <br />
              akıllı finansal kararlar.
            </p>
            <button onClick={() => openModal("pro")}>
              Finova Pro'yu keşfet <ArrowUpRight size={15} />
            </button>
            <span className="pro-decoration" />
          </div>
          <div className="secondary-nav">
            <button onClick={() => openModal("help")}>
              <CircleHelp size={18} />
              Yardım Merkezi
              <ArrowUpRight size={14} />
            </button>
            <button onClick={() => openModal("settings")}>
              <Settings size={18} />
              Ayarlar
            </button>
          </div>
          <button
            className="user-profile"
            onClick={() => openModal("settings")}
          >
            <span className="avatar">AY</span>
            <span>
              <strong>Ahmet Yılmaz</strong>
              <small>Hesap yöneticisi</small>
            </span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu size={21} />
            </button>
            <span>Çalışma alanı</span>
            <ChevronRight size={13} />
            <strong>{navigation.find((n) => n.id === page)?.label}</strong>
          </div>
          <div className="topbar-right">
            <div className="global-search">
              <Search size={16} />
              <input
                ref={searchRef}
                aria-label="İşlemlerde ara"
                placeholder="Bir şey arayın..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
              />
              <kbd>⌘ K</kbd>
              {searchOpen && query.trim() && (
                <div className="search-results">
                  <div className="search-results-title">İŞLEM SONUÇLARI</div>
                  {matchedTransactions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDetail(item);
                        setSearchOpen(false);
                      }}
                    >
                      <TransactionIcon icon={item.icon} type={item.type} />
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.category} · {dateText(item.date)}
                        </small>
                      </span>
                      <b className={item.type}>{currency(item.amount, 0)}</b>
                    </button>
                  ))}
                  {!matchedTransactions.length && (
                    <p>“{query}” için sonuç bulunamadı.</p>
                  )}
                </div>
              )}
            </div>
            <span className="topbar-divider" />
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Bildirimler"
              >
                <Bell size={20} />
                {!notificationsRead && <i />}
              </button>
              {notificationsOpen && (
                <div className="notifications-panel">
                  <div>
                    <h3>Bildirimler</h3>
                    <button
                      className="text-button"
                      onClick={() => {
                        setNotificationsRead(true);
                        setToast("Tüm bildirimler okundu olarak işaretlendi.");
                      }}
                    >
                      <CheckCheck size={16} />
                      Tümünü oku
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      navigate("schedule");
                      setNotificationsOpen(false);
                    }}
                  >
                    <span className="notification-icon">
                      <Clock3 size={19} />
                    </span>
                    <span>
                      <strong>Ödeme takviminiz güncel</strong>
                      <small>
                        {pending.length} bekleyen işleminiz var. Detayları
                        görüntüleyin.
                      </small>
                      <em>Az önce</em>
                    </span>
                  </button>
                  <div className="notification-footer">
                    Bildirimleriniz bu cihazda gösterilir.
                  </div>
                </div>
              )}
            </div>
            <button
              className="topbar-avatar"
              onClick={() => openModal("settings")}
              aria-label="Profil ayarları"
            >
              AY
            </button>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="greeting">
                Finansınız, kontrolünüzde. <span>✦</span>
              </div>
              <h1>{titles[page][0]}</h1>
              <p>{titles[page][1]}</p>
            </div>
            <div className="heading-actions">
              <label className="date-select">
                <CalendarDays size={16} />
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  aria-label="Rapor dönemi"
                >
                  {monthNames.map((name, index) => (
                    <option key={name} value={index + 1}>
                      {index === 9 ? "1 – 31 Ekim 2026" : `${name} 2026`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} />
              </label>
              <button
                className="button button-primary"
                onClick={() =>
                  page === "reports"
                    ? exportReport()
                    : openModal(
                        page === "accounts"
                          ? "account"
                          : page === "contacts"
                            ? "contact"
                            : page === "schedule"
                              ? "due"
                              : "transaction",
                      )
                }
              >
                {page === "reports" ? (
                  <Download size={17} />
                ) : (
                  <Plus size={18} />
                )}
                {pageAction}
              </button>
            </div>
          </div>

          {page === "overview" && (
            <>
              <Stats />
              <div className="dashboard-grid charts-grid">
                <CashFlowCard />
                <ExpenseCard />
              </div>
              <div className="dashboard-grid bottom-grid">
                <section className="card recent-card">
                  <div className="card-heading">
                    <div>
                      <h2>Son İşlemler</h2>
                      <p>En son finansal hareketleriniz</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("transactions")}
                    >
                      Tümünü gör <ArrowRight size={15} />
                    </button>
                  </div>
                  <TransactionTable compact />
                  <div className="table-footer">
                    <span>
                      <span className="live-dot" />
                      Hesaplarınız güncel
                    </span>
                    <span>
                      Son güncelleme: az önce <ShieldCheck size={13} />
                    </span>
                  </div>
                </section>
                <UpcomingCard />
              </div>
              <section className="accounts-section">
                <div className="section-heading">
                  <h2>
                    Banka Hesaplarım <span>{accounts.length} hesap</span>
                  </h2>
                  <button
                    className="text-button"
                    onClick={() => navigate("accounts")}
                  >
                    Hesapları yönet <ArrowRight size={15} />
                  </button>
                </div>
                <div className="bank-grid">
                  {accounts.slice(0, 3).map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </section>
            </>
          )}

          {page === "transactions" && (
            <>
              <div className="mini-stats">
                <div>
                  <span>Toplam gelir</span>
                  <strong className="income">{currency(income)}</strong>
                  <ArrowDownLeft />
                </div>
                <div>
                  <span>Toplam gider</span>
                  <strong>{currency(expense)}</strong>
                  <ArrowUpRight />
                </div>
                <div>
                  <span>Net nakit akışı</span>
                  <strong>{currency(income - expense)}</strong>
                  <TrendingUp />
                </div>
              </div>
              <section className="card full-table-card">
                <div className="table-toolbar">
                  <div className="tabs">
                    {[
                      ["all", "Tüm işlemler"],
                      ["income", "Gelirler"],
                      ["expense", "Giderler"],
                    ].map(([value, label]) => (
                      <button
                        className={filter === value ? "active" : ""}
                        key={value}
                        onClick={() => setFilter(value)}
                      >
                        {label}
                        {value === "all" && (
                          <span>{monthTransactions.length}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="table-tools">
                    <label className="table-search">
                      <Search size={16} />
                      <input
                        placeholder="İşlem ara..."
                        aria-label="İşlem filtrele"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                    <select
                      className="select-filter"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      aria-label="Kategori filtresi"
                    >
                      <option value="all">Tüm kategoriler</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      className="icon-button bordered"
                      onClick={exportReport}
                      aria-label="İşlemleri indir"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                <TransactionTable />
                <div className="table-footer">
                  <span>
                    Toplam {filteredTransactions.length} işlem gösteriliyor
                  </span>
                  <span>{monthNames[month - 1]} 2026</span>
                </div>
              </section>
            </>
          )}

          {page === "accounts" && (
            <>
              <div className="balance-banner">
                <span className="banner-icon">
                  <Wallet size={26} />
                </span>
                <div>
                  <p>Tüm hesaplarınızdaki toplam bakiye</p>
                  <h2>
                    <Money value={balance} />
                  </h2>
                </div>
                <span className="banner-tag">
                  <span className="live-dot" />
                  {accounts.length} aktif hesap
                </span>
                <div className="banner-decoration" />
              </div>
              <div className="bank-grid expanded">
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
                <button
                  className="add-account-card"
                  onClick={() => openModal("account")}
                >
                  <span>
                    <Plus size={24} />
                  </span>
                  <strong>Yeni banka hesabı ekleyin</strong>
                  <p>Finansınızın tamamı bir arada.</p>
                </button>
              </div>
              <div className="info-banner">
                <ShieldCheck size={20} />
                <div>
                  <strong>Hesaplarınız sizin kontrolünüzde.</strong>
                  <p>
                    Bakiyeler, kaydettiğiniz işlemlerle otomatik güncellenir. Bu
                    demo banka bağlantısı kurmaz.
                  </p>
                </div>
              </div>
              <section className="card">
                <div className="card-heading">
                  <div>
                    <h2>Son Hesap Hareketleri</h2>
                    <p>Banka hesaplarınızdaki en güncel işlemler</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => navigate("transactions")}
                  >
                    Tümünü gör <ArrowRight size={15} />
                  </button>
                </div>
                <TransactionTable compact />
              </section>
            </>
          )}

          {page === "contacts" && (
            <>
              <div className="mini-stats">
                <div>
                  <span>Toplam alacak</span>
                  <strong className="income">
                    {currency(sum(contacts, (c) => c.receivable))}
                  </strong>
                  <ArrowDownLeft />
                </div>
                <div>
                  <span>Toplam borç</span>
                  <strong className="expense">
                    {currency(sum(contacts, (c) => c.payable))}
                  </strong>
                  <ArrowUpRight />
                </div>
                <div>
                  <span>Aktif cari hesap</span>
                  <strong>
                    {contacts.length}
                    <small> müşteri ve tedarikçi</small>
                  </strong>
                  <Users />
                </div>
              </div>
              <section className="card">
                <div className="card-heading">
                  <div>
                    <h2>Müşteriler & Tedarikçiler</h2>
                    <p>Güçlü ilişkiler, sağlıklı finans.</p>
                  </div>
                  <label className="table-search">
                    <Search size={16} />
                    <input
                      placeholder="Cari hesap ara..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Cari hesap ara"
                    />
                  </label>
                </div>
                <div className="table-scroll">
                  <table className="contacts-table">
                    <thead>
                      <tr>
                        <th>Firma / Kişi</th>
                        <th>İletişim</th>
                        <th className="align-right">Alacak</th>
                        <th className="align-right">Borç</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {contacts
                        .filter((c) =>
                          `${c.company} ${c.name} ${c.email}`
                            .toLocaleLowerCase("tr")
                            .includes(query.toLocaleLowerCase("tr")),
                        )
                        .map((c) => (
                          <tr key={c.id} onClick={() => setDetail(c)}>
                            <td>
                              <div className="contact-name">
                                <span
                                  className="contact-avatar"
                                  style={{ background: c.color }}
                                >
                                  {c.initials}
                                </span>
                                <div>
                                  <strong>{c.company}</strong>
                                  <span>{c.name}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="contact-info">
                                <span>{c.email || "E-posta eklenmedi"}</span>
                                <small>{c.phone || "Telefon eklenmedi"}</small>
                              </div>
                            </td>
                            <td className="align-right income">
                              {currency(c.receivable)}
                            </td>
                            <td className="align-right">
                              {currency(c.payable)}
                            </td>
                            <td>
                              <button
                                className="icon-button"
                                aria-label={`${c.company} cari hesap detayları`}
                              >
                                <ChevronRight size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {!contacts.some((c) =>
                    `${c.company} ${c.name} ${c.email}`
                      .toLocaleLowerCase("tr")
                      .includes(query.toLocaleLowerCase("tr")),
                  ) && (
                    <EmptyState
                      title="Cari hesap bulunamadı"
                      description="Arama ifadenizi değiştirebilir veya yeni bir cari hesap ekleyebilirsiniz."
                    />
                  )}
                </div>
              </section>
            </>
          )}

          {page === "schedule" && (
            <>
              <div className="mini-stats">
                <div>
                  <span>Beklenen tahsilatlar</span>
                  <strong className="income">{currency(pendingIncome)}</strong>
                  <ArrowDownLeft />
                </div>
                <div>
                  <span>Yaklaşan ödemeler</span>
                  <strong className="expense">
                    {currency(pendingExpense)}
                  </strong>
                  <ArrowUpRight />
                </div>
                <div>
                  <span>Beklenen net nakit</span>
                  <strong>{currency(pendingIncome - pendingExpense)}</strong>
                  <Wallet />
                </div>
              </div>
              <section className="card">
                <div className="table-toolbar">
                  <div className="tabs">
                    {[
                      ["all", "Tüm işlemler"],
                      ["expense", "Ödemeler"],
                      ["income", "Tahsilatlar"],
                      ["completed", "Tamamlananlar"],
                    ].map(([value, label]) => (
                      <button
                        className={filter === value ? "active" : ""}
                        key={value}
                        onClick={() => setFilter(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <span className="schedule-date">
                    <CalendarDays size={16} />
                    Ekim 2026
                  </span>
                </div>
                <div className="schedule-list">
                  {dueItems
                    .filter((d) =>
                      filter === "completed"
                        ? d.status === "completed"
                        : d.status === "pending" &&
                          (filter === "all" || d.type === filter),
                    )
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((item) => (
                      <div className="schedule-item" key={item.id}>
                        <span className="date-block">
                          <b>{item.date.slice(-2)}</b>
                          <span>
                            {monthNames[Number(item.date.slice(5, 7)) - 1]
                              .slice(0, 3)
                              .toLocaleUpperCase("tr")}
                          </span>
                        </span>
                        <TransactionIcon type={item.type} icon={item.icon} />
                        <div className="schedule-name">
                          <strong>{item.name}</strong>
                          <span>{item.description}</span>
                        </div>
                        <span className={`type-pill ${item.type}`}>
                          {item.type === "income" ? (
                            <ArrowDownLeft size={13} />
                          ) : (
                            <ArrowUpRight size={13} />
                          )}
                          {item.type === "income" ? "Tahsilat" : "Ödeme"}
                        </span>
                        <strong className="schedule-amount">
                          {currency(item.amount)}
                        </strong>
                        {item.status === "completed" ? (
                          <span className="completed-label">
                            <CheckCheck size={16} />
                            Tamamlandı
                          </span>
                        ) : (
                          <button
                            className="button button-secondary"
                            onClick={() => completeDue(item)}
                          >
                            <Check size={15} />
                            {item.type === "income"
                              ? "Tahsil et"
                              : "Ödendi işaretle"}
                          </button>
                        )}
                      </div>
                    ))}
                  {!dueItems.some((d) =>
                    filter === "completed"
                      ? d.status === "completed"
                      : d.status === "pending" &&
                        (filter === "all" || d.type === filter),
                  ) && (
                    <EmptyState
                      title="Burada her şey tamam"
                      description="Bu görünümde gösterilecek işlem bulunmuyor."
                    />
                  )}
                </div>
                <div className="schedule-footer">
                  <ShieldCheck size={15} />
                  Tamamlanan ödemeler ve tahsilatlar ana banka hesabınıza
                  otomatik işlenir.
                </div>
              </section>
            </>
          )}

          {page === "reports" && (
            <>
              <Stats />
              <div className="dashboard-grid charts-grid">
                <CashFlowCard />
                <ExpenseCard />
              </div>
              <div className="report-grid">
                <section className="card">
                  <div className="card-heading">
                    <div>
                      <h2>Gelir & Gider Özeti</h2>
                      <p>
                        {monthNames[month - 1]} 2026 finansal performansınız
                      </p>
                    </div>
                    <FileText size={20} className="muted" />
                  </div>
                  <div className="report-summary">
                    <div>
                      <span>Toplam gelir</span>
                      <strong className="income">{currency(income)}</strong>
                    </div>
                    <div>
                      <span>Toplam gider</span>
                      <strong>{currency(expense)}</strong>
                    </div>
                    <div className="report-net">
                      <span>Net kâr</span>
                      <strong>{currency(income - expense)}</strong>
                    </div>
                    <div>
                      <span>Kâr marjı</span>
                      <strong>
                        %
                        {income
                          ? (((income - expense) / income) * 100)
                              .toFixed(1)
                              .replace(".", ",")
                          : "0"}
                      </strong>
                    </div>
                  </div>
                </section>
                <section className="card">
                  <div className="card-heading">
                    <div>
                      <h2>Kategori Bazında Harcamalar</h2>
                      <p>Bütçenizin nereye gittiğini görün</p>
                    </div>
                  </div>
                  <div className="category-bars">
                    {expenseCategories.map((item) => (
                      <div key={item.label}>
                        <div>
                          <span>{item.label}</span>
                          <strong>{currency(item.amount, 0)}</strong>
                        </div>
                        <span className="category-track">
                          <i
                            style={{
                              width: `${(item.amount / expense) * 100}%`,
                              background: item.color,
                            }}
                          />
                        </span>
                      </div>
                    ))}
                    {!expenseCategories.length && (
                      <EmptyState title="Gider kaydı bulunmuyor" />
                    )}
                  </div>
                </section>
              </div>
              <div className="report-export">
                <span className="report-export-icon">
                  <Download size={24} />
                </span>
                <div>
                  <h3>Raporlarınız, her zaman yanınızda.</h3>
                  <p>
                    Seçtiğiniz dönemin tüm işlemlerini Excel uyumlu CSV olarak
                    indirin.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={exportReport}
                >
                  <Download size={16} />
                  Raporu indir
                </button>
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>© 2026 Finova. Finansınız, kontrolünüzde.</span>
            <span>
              <span className="live-dot" />
              Demo çalışma alanı <span className="footer-separator">
                ·
              </span>{" "}
              Veriler bu tarayıcıda saklanır
            </span>
          </footer>
        </main>
      </div>

      {(modal || detail) && (
        <div
          className="modal-backdrop"
          onClick={(e) =>
            e.target === e.currentTarget && (setModal(null), setDetail(null))
          }
        >
          <div
            className={`modal ${modal === "help" ? "help-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={modalRef}
          >
            <div className="modal-heading">
              <div>
                <span className="modal-eyebrow">FINOVA ÇALIŞMA ALANI</span>
                <h2 id="modal-title">
                  {detail
                    ? "amount" in detail
                      ? "İşlem detayları"
                      : "bank" in detail
                        ? "Hesap detayları"
                        : "Cari hesap detayları"
                    : modal === "transaction"
                      ? "Yeni işlem ekle"
                      : modal === "account"
                        ? "Banka hesabı ekle"
                        : modal === "contact"
                          ? "Cari hesap oluştur"
                          : modal === "due"
                            ? "Yeni işlem planla"
                            : modal === "settings"
                              ? "Çalışma alanı ayarları"
                              : modal === "pro"
                                ? "Finova ile bir adım önde"
                                : "Size nasıl yardımcı olabiliriz?"}
                </h2>
              </div>
              <button
                className="icon-button"
                aria-label="Pencereyi kapat"
                onClick={() => {
                  setModal(null);
                  setDetail(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            {(modal === "transaction" || modal === "due") && (
              <form
                onSubmit={modal === "transaction" ? saveTransaction : saveDue}
              >
                <div className="form-type-selector">
                  <button
                    type="button"
                    className={type === "income" ? "active income" : ""}
                    onClick={() => setType("income")}
                  >
                    <ArrowDownLeft size={18} />
                    {modal === "due" ? "Tahsilat" : "Gelir"}
                  </button>
                  <button
                    type="button"
                    className={type === "expense" ? "active expense" : ""}
                    onClick={() => setType("expense")}
                  >
                    <ArrowUpRight size={18} />
                    {modal === "due" ? "Ödeme" : "Gider"}
                  </button>
                </div>
                <label className="form-field">
                  İşlem adı
                  <input
                    name="name"
                    placeholder="Örn. Atlas Yazılım proje ödemesi"
                    required
                    maxLength={80}
                  />
                </label>
                <div className="form-row">
                  <label className="form-field">
                    Tutar (₺)
                    <input
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0,00"
                      required
                    />
                  </label>
                  <label className="form-field">
                    {modal === "due" ? "Vade tarihi" : "İşlem tarihi"}
                    <input
                      name="date"
                      type="date"
                      defaultValue={
                        modal === "due" ? "2026-10-20" : "2026-10-17"
                      }
                      min="2026-01-01"
                      max="2026-12-31"
                      required
                    />
                  </label>
                </div>
                {modal === "transaction" && (
                  <div className="form-row">
                    <label className="form-field">
                      Kategori
                      <select
                        name="category"
                        defaultValue={type === "income" ? "Hizmet" : "Diğer"}
                      >
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <label className="form-field">
                      Banka hesabı
                      <select name="account">
                        {accounts.map((a) => (
                          <option key={a.id}>{a.bank}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
                <label className="form-field">
                  Açıklama <span>(isteğe bağlı)</span>
                  <textarea
                    name="description"
                    placeholder="İşlem hakkında kısa bir not..."
                    rows={3}
                    maxLength={240}
                  />
                </label>
                {formError && <p className="form-error">{formError}</p>}
                <div className="form-note">
                  <ShieldCheck size={15} />
                  {modal === "transaction"
                    ? "Hesap bakiyeniz bu işlemle birlikte güncellenir."
                    : "Planlanan işlemler tamamlanana kadar bakiyenizi etkilemez."}
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setModal(null)}
                  >
                    Vazgeç
                  </button>
                  <button className="button button-primary" type="submit">
                    <Check size={16} />
                    {modal === "due" ? "Takvime ekle" : "İşlemi kaydet"}
                  </button>
                </div>
              </form>
            )}
            {modal === "account" && (
              <form onSubmit={saveAccount}>
                <p className="modal-intro">
                  Banka hesabınızı ekleyin, tüm bakiyelerinizi bir arada takip
                  edin.
                </p>
                <label className="form-field">
                  Banka adı
                  <input
                    name="bank"
                    placeholder="Örn. Akbank"
                    required
                    maxLength={40}
                  />
                </label>
                <label className="form-field">
                  Hesap adı
                  <input
                    name="name"
                    placeholder="Örn. İşletme hesabım"
                    required
                    maxLength={50}
                  />
                </label>
                <label className="form-field">
                  IBAN <span>(isteğe bağlı)</span>
                  <input
                    name="iban"
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    maxLength={40}
                  />
                </label>
                <label className="form-field">
                  Açılış bakiyesi (₺)
                  <input
                    name="balance"
                    type="number"
                    step="0.01"
                    defaultValue="0"
                    required
                  />
                </label>
                {formError && <p className="form-error">{formError}</p>}
                <div className="form-note">
                  <ShieldCheck size={15} />
                  Manuel takip hesabıdır; bankanıza bağlantı kurulmaz.
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setModal(null)}
                  >
                    Vazgeç
                  </button>
                  <button type="submit" className="button button-primary">
                    <Plus size={16} />
                    Hesabı ekle
                  </button>
                </div>
              </form>
            )}
            {modal === "contact" && (
              <form onSubmit={saveContact}>
                <div className="form-row">
                  <label className="form-field">
                    Firma adı
                    <input
                      name="company"
                      placeholder="Örn. Atlas Yazılım"
                      required
                      maxLength={60}
                    />
                  </label>
                  <label className="form-field">
                    Yetkili kişi
                    <input
                      name="name"
                      placeholder="Ad ve soyad"
                      required
                      maxLength={60}
                    />
                  </label>
                </div>
                <label className="form-field">
                  E-posta
                  <input
                    name="email"
                    type="email"
                    placeholder="ornek@firma.com"
                  />
                </label>
                <label className="form-field">
                  Telefon
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+90 5__ ___ __ __"
                  />
                </label>
                <div className="form-row">
                  <label className="form-field">
                    Mevcut alacak (₺)
                    <input
                      name="receivable"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="0"
                      required
                    />
                  </label>
                  <label className="form-field">
                    Mevcut borç (₺)
                    <input
                      name="payable"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="0"
                      required
                    />
                  </label>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setModal(null)}
                  >
                    Vazgeç
                  </button>
                  <button className="button button-primary" type="submit">
                    <Plus size={16} />
                    Cari hesap oluştur
                  </button>
                </div>
              </form>
            )}
            {modal === "settings" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setWorkspace(
                    String(
                      new FormData(e.currentTarget).get("workspace"),
                    ).trim(),
                  );
                  setModal(null);
                  setToast("Çalışma alanı ayarlarınız kaydedildi.");
                }}
              >
                <p className="modal-intro">
                  Çalışma alanınızı işletmenize göre kişiselleştirin.
                </p>
                <label className="form-field">
                  İşletme adı
                  <input
                    name="workspace"
                    defaultValue={workspace}
                    required
                    maxLength={40}
                  />
                </label>
                <div className="form-row">
                  <label className="form-field">
                    Para birimi
                    <select defaultValue="TRY">
                      <option value="TRY">Türk Lirası (₺)</option>
                    </select>
                  </label>
                  <label className="form-field">
                    Dil
                    <select defaultValue="tr">
                      <option value="tr">Türkçe</option>
                    </select>
                  </label>
                </div>
                <div className="settings-info">
                  <ShieldCheck size={21} />
                  <div>
                    <strong>Verileriniz bu cihazda</strong>
                    <p>
                      Bu uygulama örnek verilerle çalışır. Kayıtlarınız bu
                      tarayıcının yerel deposunda tutulur. Yedek almak için
                      raporlarınızı indirin.
                    </p>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setModal(null)}
                  >
                    Vazgeç
                  </button>
                  <button className="button button-primary" type="submit">
                    <Check size={16} />
                    Değişiklikleri kaydet
                  </button>
                </div>
              </form>
            )}
            {modal === "help" && (
              <div className="help-content">
                <p className="modal-intro">
                  Finova'yı kullanmaya başlamak çok kolay.
                </p>
                {[
                  [
                    "Gelir ve gider nasıl eklerim?",
                    "“İşlem ekle” düğmesine tıklayın. Gelir veya gider türünü seçip tutarı ve banka hesabını girin. Hesap bakiyeniz anında güncellenir.",
                  ],
                  [
                    "Ödemelerimi nasıl takip ederim?",
                    "Ödemeler & Tahsilatlar sayfasından işlem planlayın. Ödeme gerçekleştiğinde “Ödendi işaretle”, tahsilatta ise “Tahsil et” düğmesini kullanın.",
                  ],
                  [
                    "Raporlarımı nasıl dışa aktarırım?",
                    "Raporlar sayfasında istediğiniz ayı seçin ve “Raporu indir” düğmesine tıklayın. CSV dosyasını Excel veya Google E-Tablolar ile açabilirsiniz.",
                  ],
                  [
                    "Verilerim nerede saklanıyor?",
                    "Bu demo, kayıtlarınızı kullandığınız tarayıcıda saklar. Canlı banka bağlantısı veya cihazlar arasında senkronizasyon içermez.",
                  ],
                ].map(([q, a]) => (
                  <details key={q}>
                    <summary>
                      {q}
                      <ChevronDown size={16} />
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
                <button
                  className="button button-primary full-width"
                  onClick={() => setModal(null)}
                >
                  Anladım, başlayalım <ArrowRight size={16} />
                </button>
              </div>
            )}
            {modal === "pro" && (
              <div className="pro-modal-content">
                <span className="pro-modal-icon">
                  <Sparkles size={32} />
                </span>
                <p>Finansal kararlarınıza daha fazla güç katın.</p>
                <ul>
                  <li>
                    <Check size={17} />
                    Gelişmiş finansal raporlar
                  </li>
                  <li>
                    <Check size={17} />
                    Birden fazla çalışma alanı
                  </li>
                  <li>
                    <Check size={17} />
                    Ekip üyeleri ve yetkilendirme
                  </li>
                  <li>
                    <Check size={17} />
                    Otomatik banka entegrasyonları
                  </li>
                </ul>
                <div className="coming-soon">
                  <span className="live-dot" />
                  Yakında Finova'da
                </div>
                <p className="muted">
                  Şu anda demo sürümü kullanıyorsunuz. Mevcut finans takip
                  özelliklerini ücretsiz keşfedebilirsiniz.
                </p>
                <button
                  className="button button-primary full-width"
                  onClick={() => setModal(null)}
                >
                  Keşfetmeye devam et <ArrowRight size={16} />
                </button>
              </div>
            )}
            {detail && "amount" in detail && (
              <div className="detail-content">
                <div className="detail-hero">
                  <TransactionIcon icon={detail.icon} type={detail.type} />
                  <h3>{detail.name}</h3>
                  <strong className={detail.type}>
                    {detail.type === "income" ? "+" : "−"}
                    {currency(detail.amount)}
                  </strong>
                  <span className="status-badge completed">● Tamamlandı</span>
                </div>
                <dl>
                  <div>
                    <dt>İşlem türü</dt>
                    <dd>{detail.type === "income" ? "Gelir" : "Gider"}</dd>
                  </div>
                  <div>
                    <dt>Kategori</dt>
                    <dd>{detail.category}</dd>
                  </div>
                  <div>
                    <dt>Tarih</dt>
                    <dd>{dateText(detail.date, true)}</dd>
                  </div>
                  <div>
                    <dt>Banka hesabı</dt>
                    <dd>{detail.account}</dd>
                  </div>
                  <div>
                    <dt>Açıklama</dt>
                    <dd>{detail.description || "Açıklama eklenmemiş"}</dd>
                  </div>
                </dl>
                <div className="modal-actions">
                  <button
                    className="button button-danger"
                    onClick={() => deleteTransaction(detail)}
                  >
                    İşlemi sil
                  </button>
                  <button
                    className="button button-primary"
                    onClick={() => setDetail(null)}
                  >
                    Tamam
                  </button>
                </div>
              </div>
            )}
            {detail && "bank" in detail && (
              <div className="detail-content">
                <div className="detail-hero">
                  <span
                    className="bank-logo"
                    style={{
                      color: detail.color,
                      background: `${detail.color}10`,
                    }}
                  >
                    {detail.logo}
                  </span>
                  <h3>{detail.bank}</h3>
                  <p>{detail.name}</p>
                  <strong>{currency(detail.balance)}</strong>
                </div>
                <dl>
                  <div>
                    <dt>IBAN</dt>
                    <dd>{detail.iban}</dd>
                  </div>
                  <div>
                    <dt>Para birimi</dt>
                    <dd>Türk Lirası (TRY)</dd>
                  </div>
                  <div>
                    <dt>Durum</dt>
                    <dd className="income">Aktif · Manuel takip</dd>
                  </div>
                  <div>
                    <dt>Kayıtlı işlem</dt>
                    <dd>
                      {
                        transactions.filter((t) => t.account === detail.bank)
                          .length
                      }{" "}
                      işlem
                    </dd>
                  </div>
                </dl>
                <button
                  className="button button-primary full-width"
                  onClick={() => {
                    setDetail(null);
                    navigate("transactions");
                    setQuery(detail.bank);
                  }}
                >
                  Hesap hareketlerini gör <ArrowRight size={16} />
                </button>
              </div>
            )}
            {detail && "company" in detail && (
              <div className="detail-content">
                <div className="detail-hero">
                  <span
                    className="contact-avatar"
                    style={{ background: detail.color }}
                  >
                    {detail.initials}
                  </span>
                  <h3>{detail.company}</h3>
                  <p>{detail.name}</p>
                </div>
                <dl>
                  <div>
                    <dt>E-posta</dt>
                    <dd>{detail.email || "Belirtilmedi"}</dd>
                  </div>
                  <div>
                    <dt>Telefon</dt>
                    <dd>{detail.phone || "Belirtilmedi"}</dd>
                  </div>
                  <div>
                    <dt>Alacak bakiyesi</dt>
                    <dd className="income">{currency(detail.receivable)}</dd>
                  </div>
                  <div>
                    <dt>Borç bakiyesi</dt>
                    <dd>{currency(detail.payable)}</dd>
                  </div>
                  <div>
                    <dt>Net bakiye</dt>
                    <dd>{currency(detail.receivable - detail.payable)}</dd>
                  </div>
                </dl>
                <button
                  className="button button-primary full-width"
                  onClick={() => {
                    setDetail(null);
                    openModal("due");
                  }}
                >
                  Ödeme / Tahsilat planla <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={17} />
          </span>
          {toast}
          <button onClick={() => setToast("")} aria-label="Bildirimi kapat">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
