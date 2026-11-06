import { CheckCircle2, Clock3, XCircle, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const variants = {
  pending: {
    label: "待审核",
    icon: Clock3,
    style:
      "border-transparent bg-pending-soft text-foreground [&_svg]:text-pending",
  },
  approved: {
    label: "已审核",
    icon: CheckCircle2,
    style:
      "border-transparent bg-success-soft text-foreground [&_svg]:text-success",
  },
  rejected: {
    label: "已驳回",
    icon: XCircle,
    style:
      "border-transparent bg-danger-soft text-foreground [&_svg]:text-destructive",
  },
  confirmed: {
    label: "已确认",
    icon: CheckCircle2,
    style:
      "border-transparent bg-success-soft text-foreground [&_svg]:text-success",
  },
  awaiting: {
    label: "待确认",
    icon: Clock3,
    style:
      "border-transparent bg-pending-soft text-foreground [&_svg]:text-pending",
  },
  revoked: {
    label: "已撤销",
    icon: XCircle,
    style: "border-border bg-muted text-muted-foreground",
  },
} satisfies Record<string, { label: string; icon: LucideIcon; style: string }>;

export type Status = keyof typeof variants;
export function StatusBadge({ status }: { status: Status }) {
  const { label, icon: Icon, style } = variants[status];
  return (
    <Badge variant="outline" className={style}>
      <Icon aria-hidden="true" className="size-3" />
      {label}
    </Badge>
  );
}
