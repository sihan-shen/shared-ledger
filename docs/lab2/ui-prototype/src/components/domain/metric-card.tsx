import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  caption,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  caption: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="py-5">
      <CardContent className="px-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Icon aria-hidden="true" className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}
