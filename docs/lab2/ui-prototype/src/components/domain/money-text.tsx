import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";

export function MoneyText({
  cents,
  signed = false,
  className,
}: {
  cents: number;
  signed?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("whitespace-nowrap font-medium tabular-nums", className)}
    >
      {signed && cents > 0 ? "+" : ""}
      {formatMoney(cents)}
    </span>
  );
}
