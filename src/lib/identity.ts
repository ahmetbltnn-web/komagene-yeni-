export const defaultIdentity = {
  appName: "M HANS GROUP",
  ownerName: "Ahmet Bulut",
};

export const defaultWorkspace = "M HANS GROUP";

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toLocaleUpperCase("tr-TR");
}

export function localDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return parts;
}
