import { ArrowDownLeft, ArrowRight, CircleHelp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmAction } from "@/components/domain/confirm-action";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { MoneyText } from "@/components/domain/money-text";
import { StatusBadge } from "@/components/domain/status-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { MobileShell } from "@/layouts/app-shell";
import { members, memberName, currentMemberId } from "@/data/demo";
import { useLedger } from "@/state/ledger";

export function SettlementPage() {
  const { state, dispatch } = useLedger();
  const pending = state.repayments.filter((item) => item.status === "pending");
  const reserved = pending
    .filter(
      (item) => item.from === currentMemberId || item.to === currentMemberId,
    )
    .reduce((total, item) => total + item.amount, 0);
  const balance = state.balances[currentMemberId];
  const available = Math.max(0, Math.abs(balance) - reserved);
  return (
    <MobileShell>
      <div className="page-stack">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">SETTLEMENT / 14</p>
            <h1 className="page-title">结算与还款</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="查看结算说明">
                <CircleHelp aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>余额和待确认还款</DialogTitle>
                <DialogDescription>
                  正余额表示应收，负余额表示应付。所有成员净余额合计为零。还款登记后先占用额度，收款人确认实际到账后才更新余额；本原型不执行转账。
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <section className="soft-panel">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet aria-hidden="true" className="size-4 text-primary" />
            我的净余额 · {balance >= 0 ? "应收" : "应付"}
          </div>
          <MoneyText
            cents={balance}
            signed
            className="my-4 block text-4xl font-semibold tracking-tight text-primary"
          />
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">待确认占用</p>
              <MoneyText cents={reserved} />
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                当前可{balance >= 0 ? "收" : "付"}
              </p>
              <MoneyText cents={available} />
            </div>
          </div>
        </section>
        <section>
          <div className="section-heading">
            <h2 className="section-title">成员余额</h2>
            <span className="text-xs text-muted-foreground">
              合计{" "}
              <MoneyText
                cents={Object.values(state.balances).reduce(
                  (sum, value) => sum + value,
                  0,
                )}
              />
            </span>
          </div>
          <ul className="divide-y rounded-md border bg-card px-5">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div className="flex items-center gap-3">
                  <MemberAvatar id={member.id} />
                  <div>
                    <p className="font-medium">
                      {member.name}
                      {member.id === currentMemberId && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          我
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {state.balances[member.id] > 0
                        ? "应收"
                        : state.balances[member.id] < 0
                          ? "应付"
                          : "已结清"}
                    </p>
                  </div>
                </div>
                <MoneyText
                  cents={state.balances[member.id]}
                  signed
                  className={
                    state.balances[member.id] > 0 ? "text-primary" : ""
                  }
                />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <div className="section-heading">
            <h2 className="section-title">还款记录</h2>
            <span className="text-xs text-muted-foreground">
              {pending.length} 笔待确认
            </span>
          </div>
          <div className="grid gap-4">
            {state.repayments.length ? (
              state.repayments.map((item) => (
                <article key={item.id} className="soft-panel">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm">
                      <ArrowDownLeft
                        aria-hidden="true"
                        className="size-4 text-primary"
                      />
                      线下还款
                    </span>
                    <StatusBadge
                      status={
                        item.status === "pending" ? "awaiting" : item.status
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span>{memberName(item.from)}</span>
                      <ArrowRight
                        aria-label="还款给"
                        className="size-4 text-muted-foreground"
                      />
                      <span>{memberName(item.to)}</span>
                    </div>
                    <MoneyText cents={item.amount} className="text-2xl" />
                  </div>
                  <p className="my-4 text-sm text-muted-foreground">
                    {item.status === "pending"
                      ? "已登记付款，确认到账前不改变正式余额。"
                      : item.status === "revoked"
                        ? "余额变更导致额度或方向失效，此记录已自动撤销。"
                        : "收款人已确认到账，余额已同步更新。"}
                  </p>
                  {item.status === "pending" && item.to === currentMemberId && (
                    <ConfirmAction
                      title="确认已实际收到这笔还款？"
                      description={`${memberName(item.from)}向你还款。请核对线下到账情况，确认后更新双方余额。`}
                      confirmLabel="确认已收款"
                      onConfirm={() =>
                        dispatch({ type: "confirm", id: item.id })
                      }
                      trigger={<Button className="w-full">确认已收款</Button>}
                    />
                  )}
                </article>
              ))
            ) : (
              <EmptyState
                title="暂无还款记录"
                description="登记的线下还款将在这里显示。"
              />
            )}
          </div>
        </section>
        <p className="rounded-md bg-accent p-4 text-sm leading-relaxed text-accent-foreground">
          结清前需处理完待审核账目和待确认还款，并确保所有成员净余额为零。
        </p>
      </div>
    </MobileShell>
  );
}
