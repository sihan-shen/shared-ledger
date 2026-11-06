const currency = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
});

export function formatMoney(cents: number) {
  return currency.format(cents / 100);
}

export function parseMoney(input: string): number | null {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(input.trim())) return null;
  const [whole, fraction = ""] = input.trim().split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return cents > 0 ? cents : null;
}

export function splitEqually(cents: number, memberIds: string[]) {
  if (memberIds.length === 0) return [];
  const base = Math.floor(cents / memberIds.length);
  const remainder = cents % memberIds.length;
  return memberIds.map((memberId, index) => ({
    memberId,
    cents: base + (index < remainder ? 1 : 0),
  }));
}
