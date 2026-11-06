export const today = "2026-10-29";
export const currentMemberId = "a";
export const members = [
  { id: "a", name: "成员A", initial: "A", role: "账本管理员" },
  { id: "b", name: "成员B", initial: "B", role: "账本成员" },
  { id: "c", name: "成员C", initial: "C", role: "审核员" },
  { id: "d", name: "成员D", initial: "D", role: "账本成员" },
] as const;

export type TransactionStatus = "pending" | "approved" | "rejected";
export interface Allocation {
  memberId: string;
  cents: number;
}
export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  payerId: string;
  date: string;
  allocations: Allocation[];
  status: TransactionStatus;
  reviewNote?: string;
}
export interface Repayment {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: "pending" | "confirmed" | "revoked";
}
export interface LedgerState {
  transactions: Transaction[];
  repayments: Repayment[];
  balances: Record<string, number>;
  budgetUsed: number;
  notice: string | null;
}

export function createDemoState(): LedgerState {
  return {
    balances: { a: 12000, b: -8000, c: -4000, d: 0 },
    budgetUsed: 68000,
    notice: null,
    repayments: [
      { id: "p-1", from: "b", to: "a", amount: 5000, status: "pending" },
    ],
    transactions: [
      {
        id: "r-1",
        title: "周末聚餐",
        category: "餐饮",
        amount: 12000,
        payerId: "b",
        date: today,
        status: "pending",
        allocations: [
          { memberId: "a", cents: 4000 },
          { memberId: "b", cents: 4000 },
          { memberId: "c", cents: 4000 },
        ],
      },
      {
        id: "r-2",
        title: "公共日用品",
        category: "日用品",
        amount: 6800,
        payerId: "a",
        date: today,
        status: "pending",
        allocations: members.map((member) => ({
          memberId: member.id,
          cents: 1700,
        })),
      },
      {
        id: "r-3",
        title: "出行打车",
        category: "交通",
        amount: 9600,
        payerId: "c",
        date: "2026-10-28",
        status: "pending",
        allocations: [
          { memberId: "a", cents: 3200 },
          { memberId: "b", cents: 3200 },
          { memberId: "c", cents: 3200 },
        ],
      },
      {
        id: "t-1",
        title: "超市采购",
        category: "日用品",
        amount: 8600,
        payerId: "a",
        date: "2026-10-28",
        status: "approved",
        allocations: members.map((member) => ({
          memberId: member.id,
          cents: 2150,
        })),
      },
      {
        id: "t-2",
        title: "早餐",
        category: "餐饮",
        amount: 3600,
        payerId: "b",
        date: "2026-10-28",
        status: "approved",
        allocations: [
          { memberId: "a", cents: 1200 },
          { memberId: "b", cents: 1200 },
          { memberId: "c", cents: 1200 },
        ],
      },
      {
        id: "t-3",
        title: "地铁出行",
        category: "交通",
        amount: 2400,
        payerId: "c",
        date: "2026-10-27",
        status: "approved",
        allocations: [
          { memberId: "a", cents: 800 },
          { memberId: "b", cents: 800 },
          { memberId: "c", cents: 800 },
        ],
      },
    ],
  };
}

export function memberName(id: string) {
  return members.find((member) => member.id === id)?.name ?? "未知成员";
}
