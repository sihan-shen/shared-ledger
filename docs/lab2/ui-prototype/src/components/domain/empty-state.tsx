import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed px-5 py-12 text-center">
      <Inbox aria-hidden="true" className="mb-4 size-8 text-primary" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mb-5 mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action}
    </div>
  );
}
