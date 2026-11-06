import { memberName, currentMemberId, type Allocation } from "@/data/demo";
import { MemberAvatar } from "./member-avatar";
import { MoneyText } from "./money-text";

export function AllocationList({ allocations }: { allocations: Allocation[] }) {
  return (
    <ul className="divide-y rounded-md border px-4">
      {allocations.map((item) => (
        <li
          key={item.memberId}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <MemberAvatar id={item.memberId} />
            <span>
              {memberName(item.memberId)}
              {item.memberId === currentMemberId && (
                <span className="ml-2 text-xs text-muted-foreground">我</span>
              )}
            </span>
          </div>
          <MoneyText cents={item.cents} />
        </li>
      ))}
    </ul>
  );
}
