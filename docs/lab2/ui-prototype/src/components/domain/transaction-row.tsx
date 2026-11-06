import { CarFront, ShoppingBasket, Utensils, ReceiptText } from "lucide-react";
import { memberName, type Transaction } from "@/data/demo";
import { MoneyText } from "./money-text";
import { StatusBadge } from "./status-badge";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const Icon =
    (
      { 餐饮: Utensils, 日用品: ShoppingBasket, 交通: CarFront } as Record<
        string,
        typeof Utensils
      >
    )[transaction.category] ?? ReceiptText;
  return (
    <div className="flex items-start justify-between gap-3 py-4">
      <div className="flex min-w-0 gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
        </span>
        <div className="min-w-0">
          <p className="font-medium break-words">{transaction.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {transaction.category} · {memberName(transaction.payerId)}垫付 ·{" "}
            {transaction.date.slice(5)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <MoneyText cents={transaction.amount} />
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  );
}
