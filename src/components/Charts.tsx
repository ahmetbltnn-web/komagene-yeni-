import { useEffect, useId, useRef, useState } from "react";
import "./Charts.css";

type Period = "week" | "month" | "year";
type ChartPoint = { x: number; y: number };
type ChartTransaction = {
  date: string;
  type: "income" | "expense";
  amount: number;
  status: "completed" | "pending";
};

const monthLabels = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

const series: Record<
  Period,
  { dates: string[]; income: number[]; expense: number[] }
> = {
  week: {
    dates: [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ],
    income: [28000, 42000, 36000, 59000, 51000, 73000, 65000],
    expense: [18000, 26000, 22000, 35000, 28000, 32000, 26000],
  },
  month: {
    dates: [
      "01 Eki",
      "03 Eki",
      "05 Eki",
      "08 Eki",
      "10 Eki",
      "13 Eki",
      "15 Eki",
      "18 Eki",
      "20 Eki",
      "23 Eki",
      "25 Eki",
      "28 Eki",
      "31 Eki",
    ],
    income: [
      34000, 44000, 39000, 59000, 50000, 56000, 47000, 68000, 61000, 78000,
      68000, 85000, 79000,
    ],
    expense: [
      19000, 26000, 21000, 34000, 27000, 32000, 24000, 36000, 29000, 41000,
      33000, 44000, 38000,
    ],
  },
  year: {
    dates: [
      "Oca",
      "Şub",
      "Mar",
      "Nis",
      "May",
      "Haz",
      "Tem",
      "Ağu",
      "Eyl",
      "Eki",
      "Kas",
      "Ara",
    ],
    income: [
      32000, 40000, 35000, 51000, 48000, 65000, 59000, 72000, 67000, 85000,
      81000, 94000,
    ],
    expense: [
      23000, 28000, 25000, 32000, 29000, 40000, 34000, 45000, 39000, 48000,
      42000, 51000,
    ],
  },
};

function smoothPath(points: ChartPoint[]) {
  const slopes = points
    .slice(1)
    .map((point, i) => (point.y - points[i].y) / (point.x - points[i].x));
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0] || 0;
    if (i === points.length - 1) return slopes[i - 1] || 0;
    return slopes[i - 1] * slopes[i] > 0 ? (slopes[i - 1] + slopes[i]) / 2 : 0;
  });
  slopes.forEach((slope, i) => {
    if (slope === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      return;
    }
    const ratio = Math.hypot(tangents[i] / slope, tangents[i + 1] / slope);
    if (ratio > 3) {
      tangents[i] *= 3 / ratio;
      tangents[i + 1] *= 3 / ratio;
    }
  });
  return points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const previous = points[i - 1];
    const third = (point.x - previous.x) / 3;
    const cp1 = {
      x: previous.x + third,
      y: previous.y + third * tangents[i - 1],
    };
    const cp2 = { x: point.x - third, y: point.y - third * tangents[i] };
    return `${path} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${point.x},${point.y}`;
  }, "");
}

const money = (value: number) => `${value.toLocaleString("tr-TR")} ₺`;

function transactionSeries(
  period: Period,
  transactions: ChartTransaction[],
  month: number,
  year: number,
  day: number,
) {
  const today = new Date();
  const selectedYear = Number.isFinite(year)
    ? Math.max(1000, Math.min(9999, Math.trunc(year)))
    : today.getFullYear();
  const selectedMonth = Number.isFinite(month)
    ? Math.max(1, Math.min(12, Math.trunc(month)))
    : today.getMonth() + 1;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const selectedDay = Number.isFinite(day)
    ? Math.max(1, Math.min(lastDay, Math.trunc(day)))
    : Math.min(lastDay, today.getDate());
  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dates =
    period === "year"
      ? monthLabels.map((_, index) => new Date(selectedYear, index + 1, 0))
      : period === "week"
        ? Array.from(
            { length: 7 },
            (_, index) =>
              new Date(
                selectedYear,
                selectedMonth - 1,
                selectedDay - 6 + index,
              ),
          )
        : [1, 5, 10, 15, 20, 25, lastDay].map(
            (date) => new Date(selectedYear, selectedMonth - 1, date),
          );
  const cutoffs = dates.map(formatDate);
  const start =
    period === "year"
      ? `${selectedYear}-01-01`
      : period === "week"
        ? cutoffs[0]
        : `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
  const completed = transactions.filter(
    (transaction) =>
      transaction.status === "completed" &&
      transaction.date.slice(0, 10) >= start &&
      Number.isFinite(transaction.amount),
  );
  const sum = (type: "income" | "expense", cutoff: string) =>
    completed.reduce(
      (total, transaction) =>
        transaction.type === type && transaction.date.slice(0, 10) <= cutoff
          ? total + transaction.amount
          : total,
      0,
    );
  return {
    dates:
      period === "year"
        ? monthLabels
        : dates.map(
            (date) =>
              `${String(date.getDate()).padStart(2, "0")} ${monthLabels[date.getMonth()]}`,
          ),
    income: cutoffs.map((cutoff) => sum("income", cutoff)),
    expense: cutoffs.map((cutoff) => sum("expense", cutoff)),
  };
}

export function CashFlowChart({
  period,
  transactions,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  day = new Date().getDate(),
}: {
  period: Period;
  transactions?: ChartTransaction[];
  month?: number;
  year?: number;
  day?: number;
}) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(720);
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0)
        setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  const compact = containerWidth < 450;
  const data = transactions
    ? transactionSeries(period, transactions, month, year, day)
    : series[period];
  const width = compact ? 440 : 720;
  const height = compact ? 240 : 230;
  const left = compact ? 62 : 57;
  const right = 17;
  const top = 14;
  const bottom = compact ? 198 : 192;
  const plotWidth = width - left - right;
  const maximum = Math.max(
    100000,
    Math.ceil(Math.max(...data.income, ...data.expense) / 50000) * 50000,
  );
  const income = data.income.map((value, i) => ({
    x: left + (i * plotWidth) / (data.income.length - 1),
    y: bottom - (value / maximum) * (bottom - top),
  }));
  const expense = data.expense.map((value, i) => ({
    x: left + (i * plotWidth) / (data.expense.length - 1),
    y: bottom - (value / maximum) * (bottom - top),
  }));
  const incomeLine = smoothPath(income);
  const expenseLine = smoothPath(expense);
  const activeIndex =
    active === null ? null : Math.min(active, income.length - 1);
  const tooltipWidth = compact ? 185 : 163;
  const tooltipX =
    activeIndex === null
      ? 0
      : Math.max(
          left,
          Math.min(
            income[activeIndex].x - tooltipWidth / 2,
            width - tooltipWidth - 12,
          ),
        );
  const labelIndexes =
    compact && period !== "week"
      ? [
          0,
          Math.round((data.dates.length - 1) / 3),
          Math.round(((data.dates.length - 1) * 2) / 3),
          data.dates.length - 1,
        ]
      : period === "month" && !transactions
        ? [0, 2, 4, 6, 8, 10, 12]
        : data.dates.map((_, i) => i);

  return (
    <div ref={containerRef} className="chart-cash-flow">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`chart-line-svg${compact ? " chart-line-svg-compact" : ""}`}
        aria-label="Gelir ve gider nakit akışı grafiği. Noktalara odaklanarak tutarları görebilirsiniz."
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={`chart-income-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b72df" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5b72df" stopOpacity="0.005" />
          </linearGradient>
          <linearGradient
            id={`chart-expense-${id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#f0ad81" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#f0ad81" stopOpacity="0.005" />
          </linearGradient>
        </defs>
        {[0, maximum / 4, maximum / 2, (maximum * 3) / 4, maximum].map(
          (value) => {
            const y = bottom - (value / maximum) * (bottom - top);
            return (
              <g key={value}>
                <line
                  x1={left}
                  x2={width - right}
                  y1={y}
                  y2={y}
                  className="chart-grid-line"
                />
                <text
                  x={left - (compact ? 12 : 15)}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  {value === 0
                    ? "0"
                    : `${(value / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} bin`}
                </text>
              </g>
            );
          },
        )}
        <path
          d={`${incomeLine} L ${income[income.length - 1].x},${bottom} L ${left},${bottom} Z`}
          fill={`url(#chart-income-${id})`}
        />
        <path
          d={`${expenseLine} L ${expense[expense.length - 1].x},${bottom} L ${left},${bottom} Z`}
          fill={`url(#chart-expense-${id})`}
        />
        <path
          d={expenseLine}
          fill="none"
          stroke="#edaf88"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={incomeLine}
          fill="none"
          stroke="#4f67d8"
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {labelIndexes.map((i) => (
          <text
            key={i}
            x={income[i].x}
            y={height - 12}
            textAnchor="middle"
            className="chart-axis-label"
          >
            {data.dates[i]}
          </text>
        ))}
        {income.map((point, i) => (
          <rect
            key={i}
            x={point.x - plotWidth / (income.length - 1) / 2}
            y={top}
            width={plotWidth / (income.length - 1)}
            height={bottom - top}
            fill="transparent"
            className="chart-hit-area"
            tabIndex={0}
            role="button"
            aria-label={`${data.dates[i]}, gelir ${money(data.income[i])}, gider ${money(data.expense[i])}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setActive(null);
            }}
          />
        ))}
        {activeIndex !== null && (
          <g className="chart-tooltip" pointerEvents="none">
            <line
              x1={income[activeIndex].x}
              x2={income[activeIndex].x}
              y1={top}
              y2={bottom}
              stroke="#c8d8d3"
              strokeDasharray="4 4"
            />
            <circle
              cx={income[activeIndex].x}
              cy={income[activeIndex].y}
              r="4.5"
              fill="#4f67d8"
              stroke="white"
              strokeWidth="2.5"
            />
            <circle
              cx={expense[activeIndex].x}
              cy={expense[activeIndex].y}
              r="4"
              fill="#edaf88"
              stroke="white"
              strokeWidth="2.5"
            />
            <rect
              x={tooltipX}
              y={18}
              width={tooltipWidth}
              height="73"
              rx="9"
              fill="white"
              stroke="#e5ebe8"
              className="chart-tooltip-box"
            />
            <text x={tooltipX + 13} y={37} className="chart-tooltip-date">
              {data.dates[activeIndex]}
            </text>
            <circle cx={tooltipX + 16} cy={53} r="3" fill="#4f67d8" />
            <text x={tooltipX + 25} y={57} className="chart-tooltip-label">
              Gelir
            </text>
            <text
              x={tooltipX + tooltipWidth - 13}
              y={57}
              textAnchor="end"
              className="chart-tooltip-value"
            >
              {money(data.income[activeIndex])}
            </text>
            <circle cx={tooltipX + 16} cy={73} r="3" fill="#edaf88" />
            <text x={tooltipX + 25} y={77} className="chart-tooltip-label">
              Gider
            </text>
            <text
              x={tooltipX + tooltipWidth - 13}
              y={77}
              textAnchor="end"
              className="chart-tooltip-value"
            >
              {money(data.expense[activeIndex])}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export function ExpenseDonut({
  items,
}: {
  items: { label: string; amount: number; color: string }[];
}) {
  const total = items.reduce((sum, item) => sum + Math.max(item.amount, 0), 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg
      viewBox="0 0 160 160"
      className="chart-donut-svg"
      role="img"
      aria-label={`Gider dağılımı, toplam ${money(total)}. ${items.map((item) => `${item.label}: ${money(item.amount)}`).join(", ")}`}
    >
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#f0f3f1"
        strokeWidth="17"
      />
      {items.map((item) => {
        const length =
          total > 0 ? (Math.max(item.amount, 0) / total) * circumference : 0;
        const currentOffset = offset;
        offset += length;
        return (
          <circle
            key={item.label}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth="17"
            strokeDasharray={`${Math.max(0, length - 3.5)} ${circumference - Math.max(0, length - 3.5)}`}
            strokeDashoffset={-currentOffset}
            transform="rotate(-90 80 80)"
          />
        );
      })}
      <text x="80" y="73" textAnchor="middle" className="chart-donut-label">
        Toplam gider
      </text>
      <text x="80" y="95" textAnchor="middle" className="chart-donut-total">
        {money(total)}
      </text>
    </svg>
  );
}
