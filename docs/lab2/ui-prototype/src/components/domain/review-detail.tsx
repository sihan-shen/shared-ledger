import { useState } from "react";
import {
  AlertCircle,
  CheckCheck,
  Info,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AllocationList } from "./allocation-list";
import { MoneyText } from "./money-text";
import { StatusBadge } from "./status-badge";
import { ConfirmAction } from "./confirm-action";
import { currentMemberId, memberName, type Transaction } from "@/data/demo";
import { useLedger } from "@/state/ledger";

export function ReviewDetail({ transaction }: { transaction: Transaction }) {
  const { dispatch } = useLedger();
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);
  const isOwn = transaction.payerId === currentMemberId;
  const canReview = !isOwn && transaction.status === "pending";
  return (
    <section className="soft-panel" aria-label="审核详情">
      <div className="section-heading">
        <h2 className="section-title">账目详情</h2>
        <StatusBadge status={transaction.status} />
      </div>
      <p className="text-lg font-semibold">{transaction.title}</p>
      <MoneyText
        cents={transaction.amount}
        className="mt-3 block text-3xl font-semibold tracking-tight"
      />
      <dl className="mb-5 mt-5 grid grid-cols-2 gap-4 text-sm">
        {[
          ["支出分类", transaction.category],
          ["发生日期", transaction.date],
          ["录入 / 垫付人", memberName(transaction.payerId)],
          ["审核版本", "v1 · 当前提交"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="mb-1 text-xs text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mb-3 text-sm font-semibold">
        分摊明细 · {transaction.allocations.length} 人均摊
      </h3>
      <AllocationList allocations={transaction.allocations} />
      <div className="mt-5 flex items-start gap-3 rounded-md bg-accent p-4 text-sm text-accent-foreground">
        {isOwn ? (
          <ShieldX aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        ) : (
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        )}
        <div>
          <p className="font-medium">
            {isOwn ? "本人录入，不可自行审核" : "符合独立审核条件"}
          </p>
          <p className="mt-1 text-xs">
            {isOwn
              ? "请由其他具备审核权限的成员处理。"
              : "当前审核人与录入人不同；分摊成员身份不影响审核资格。"}
          </p>
        </div>
      </div>
      {transaction.status === "pending" ? (
        <>
          <Separator className="my-6" />
          <div className="field-stack">
            <Label htmlFor="review-note">
              审核意见{" "}
              <span className="font-normal text-muted-foreground">
                驳回时必填
              </span>
            </Label>
            <Textarea
              id="review-note"
              placeholder="核对金额、分类与分摊后填写意见"
              maxLength={200}
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setError(false);
              }}
              disabled={isOwn}
              aria-invalid={error}
              aria-describedby={error ? "review-note-error" : undefined}
            />
            {error && (
              <p id="review-note-error" role="alert" className="field-error">
                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                请填写驳回原因。
              </p>
            )}
          </div>
          <p className="my-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            通过后更新正式预算与余额；驳回保留意见。
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              disabled={!canReview}
              onClick={() => {
                if (!note.trim()) {
                  setError(true);
                  document.getElementById("review-note")?.focus();
                  return;
                }
                dispatch({
                  type: "review",
                  id: transaction.id,
                  approved: false,
                  note,
                });
              }}
            >
              驳回
            </Button>
            <ConfirmAction
              title="确认审核通过？"
              description={`将“${transaction.title}”计入正式预算和成员余额。请确认金额及分摊无误。`}
              confirmLabel="确认通过"
              onConfirm={() =>
                dispatch({
                  type: "review",
                  id: transaction.id,
                  approved: true,
                  note,
                })
              }
              trigger={
                <Button disabled={!canReview}>
                  <CheckCheck aria-hidden="true" />
                  审核通过
                </Button>
              }
            />
          </div>
        </>
      ) : transaction.reviewNote ? (
        <p className="mt-5 rounded-md bg-muted p-4 text-sm">
          审核意见：{transaction.reviewNote}
        </p>
      ) : null}
    </section>
  );
}
