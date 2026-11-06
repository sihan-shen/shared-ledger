import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowRight,
  CheckCheck,
  ChevronRight,
  Plus,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoneyText } from "@/components/domain/money-text";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { TransactionRow } from "@/components/domain/transaction-row";
import { EmptyState } from "@/components/domain/empty-state";
import { MobileShell } from "@/layouts/app-shell";
import { currentMemberId } from "@/data/demo";
import { useLedger } from "@/state/ledger";

export function HomePage() {
  const { state } = useLedger();
  const [filter, setFilter] = useState("all");
  const pending = state.transactions.filter(
    (item) => item.status === "pending",
  );
  const reviewable = pending.filter((item) => item.payerId !== currentMemberId);
  const repayments = state.repayments.filter(
    (item) => item.status === "pending" && item.to === currentMemberId,
  );
  const recent = state.transactions.filter(
    (item) => filter === "all" || item.status === filter,
  );
  const balance = state.balances[currentMemberId];
  const budget = 150000;
  return (
    <MobileShell>
      <div className="page-stack">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">OVERVIEW / 03</p>
            <h1 className="page-title">账本首页</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 年 10 月 29 日 · 星期四
          </p>
        </div>
        <section
          aria-label="我的余额"
          className="rounded-md bg-primary px-6 py-7 text-primary-foreground sm:px-8"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm opacity-80">周末生活账本</span>
            <span className="flex items-center gap-1.5 text-xs opacity-80">
              <Users aria-hidden="true" className="size-3.5" />4 位成员
            </span>
          </div>
          <p className="mb-2 mt-7 text-sm opacity-80">
            我的净余额 · {balance >= 0 ? "应收" : "应付"}
          </p>
          <MoneyText
            cents={balance}
            signed
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4 text-sm">
            <span className="opacity-80">仅包含已审核账目与已确认还款</span>
            <Link
              to="/settlement"
              className="inline-flex min-h-11 items-center gap-1 font-medium"
            >
              查看结算
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>
        <div className="grid grid-cols-3 gap-3">
          {[
            { to: "/entry", label: "记一笔", icon: Plus },
            { to: "/review", label: "去审核", icon: CheckCheck },
            { to: "/settlement", label: "结算还款", icon: Wallet },
          ].map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 whitespace-normal bg-card py-4"
            >
              <Link to={to}>
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <span className="text-sm">{label}</span>
              </Link>
            </Button>
          ))}
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="section-title">本月预算</CardTitle>
            <span className="text-xs text-muted-foreground">2026.10</span>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">已审核支出</p>
                <MoneyText
                  cents={state.budgetUsed}
                  className="text-2xl font-semibold"
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  / <MoneyText cents={budget} />
                </span>
              </div>
              <span className="rounded-md bg-accent px-2 py-1 text-xs text-primary">
                {Math.round((state.budgetUsed / budget) * 100)}% 已使用
              </span>
            </div>
            <Progress
              value={Math.min(100, (state.budgetUsed / budget) * 100)}
              aria-label="本月预算使用比例"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              {state.budgetUsed > budget ? "已超支" : "剩余预算"}{" "}
              <MoneyText cents={Math.abs(budget - state.budgetUsed)} />，
              {state.budgetUsed > budget
                ? "超支仅提示，不阻止记账。"
                : "待审核金额不计入已用预算。"}
            </p>
          </CardContent>
        </Card>
        <section>
          <div className="section-heading">
            <h2 className="section-title">需要你处理</h2>
            <span className="text-xs text-muted-foreground">
              审核与收款确认
            </span>
          </div>
          <div className="divide-y rounded-md border bg-card px-5">
            {[
              {
                to: "/review",
                icon: CheckCheck,
                title: `${reviewable.length} 笔账目可由你审核`,
                detail: `${pending.length} 笔待审核，已排除本人录入的账目`,
              },
              {
                to: "/settlement",
                icon: ArrowDownLeft,
                title: `${repayments.length} 笔还款待确认收款`,
                detail: "请在线下实际到账后确认",
              },
            ].map(({ to, icon: Icon, title, detail }) => (
              <Link
                to={to}
                key={to}
                className="flex min-h-24 items-center gap-3 py-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </Link>
            ))}
          </div>
        </section>
        <section>
          <div className="section-heading">
            <h2 className="section-title">最近账目</h2>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList aria-label="账目状态筛选" className="h-auto">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="pending">待审核</TabsTrigger>
                <TabsTrigger value="approved">已审核</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {recent.length ? (
            <div className="divide-y rounded-md border bg-card px-4 sm:px-5">
              {recent.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="暂无相关账目"
              description="切换筛选条件，或添加一笔新的支出。"
            />
          )}
        </section>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>一起记账，收支有据。</span>
          <div className="flex items-center -space-x-2">
            {["a", "b", "c", "d"].map((id) => (
              <MemberAvatar
                key={id}
                id={id}
                className="border-2 border-background"
              />
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
