import { members, memberName } from "@/data/demo";
import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  a: "bg-accent text-accent-foreground",
  b: "bg-info-soft text-info",
  c: "bg-pending-soft text-pending",
  d: "bg-muted text-muted-foreground",
};
export function MemberAvatar({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <span
      aria-label={memberName(id)}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        colors[id],
        className,
      )}
    >
      {members.find((member) => member.id === id)?.initial ?? "?"}
    </span>
  );
}
