import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewDetail } from "@/components/domain/review-detail";
import { EmptyState } from "@/components/domain/empty-state";
import { MoneyText } from "@/components/domain/money-text";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { MobileShell } from "@/layouts/app-shell";
import { currentMemberId, memberName } from "@/data/demo";
import { cn } from "@/lib/utils";
import { useLedger } from "@/state/ledger";

export function ReviewPage() {
  const { state } = useLedger();
  const [selectedId, setSelectedId] = useState("");
  const pending = state.transactions.filter(
    (item) => item.status === "pending",
  );
  const selected =
    pending.find((item) => item.id === selectedId) ??
    pending.find((item) => item.payerId !== currentMemberId) ??
    pending[0];
  return (
    <MobileShell>
      <div className="page-stack">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">INDEPENDENT REVIEW / 11</p>
            <h1 className="page-title">独立审核</h1>
          </div>
          <span className="flex size-12 items-center justify-center rounded-md border bg-card">
            <CheckCheck aria-hidden="true" className="size-6 text-primary" />
          </span>
        </div>
        <p className="-mt-3 text-sm text-muted-foreground">
          共 {pending.length} 笔待审核，其中{" "}
          {pending.filter((item) => item.payerId !== currentMemberId).length}{" "}
          笔可由你处理。
        </p>
        {pending.length > 0 ? (
          <>
            <section aria-label="选择待审核账目" className="grid gap-2">
              {pending.map((item) => (
                <Button
                  variant="outline"
                  key={item.id}
                  aria-pressed={selected?.id === item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "h-auto justify-between gap-3 whitespace-normal bg-card px-4 py-3 text-left",
                    selected?.id === item.id &&
                      "border-primary bg-accent hover:bg-accent",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <MemberAvatar id={item.payerId} />
                    <span className="min-w-0">
                      <span className="block break-words font-medium">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        {memberName(item.payerId)}录入
                        {item.payerId === currentMemberId
                          ? " · 本人不可审核"
                          : " · 可审核"}
                      </span>
                    </span>
                  </span>
                  <MoneyText cents={item.amount} />
                </Button>
              ))}
            </section>
            {selected && (
              <ReviewDetail key={selected.id} transaction={selected} />
            )}
          </>
        ) : (
          <EmptyState
            title="待审核账目已处理完毕"
            description="新账目提交后会出现在这里。你可以在首页查看处理后的状态。"
          />
        )}
      </div>
    </MobileShell>
  );
}
