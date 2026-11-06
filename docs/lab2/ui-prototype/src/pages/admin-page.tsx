import { useState } from "react";
import { CheckCheck, Clock3, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MetricCard } from "@/components/domain/metric-card";
import { MoneyText } from "@/components/domain/money-text";
import { ReviewDetail } from "@/components/domain/review-detail";
import { EmptyState } from "@/components/domain/empty-state";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { AdminShell } from "@/layouts/app-shell";
import { memberName, currentMemberId } from "@/data/demo";
import { cn } from "@/lib/utils";
import { useLedger } from "@/state/ledger";

export function AdminPage() {
  const { state } = useLedger();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const pending = state.transactions.filter(
    (item) => item.status === "pending",
  );
  const queue = pending.filter(
    (item) =>
      (filter === "all" ||
        (filter === "mine"
          ? item.payerId === currentMemberId
          : item.payerId !== currentMemberId)) &&
      `${item.title} ${memberName(item.payerId)} ${item.category}`.includes(
        query.trim(),
      ),
  );
  const selected =
    queue.find((item) => item.id === selectedId) ??
    queue.find((item) => item.payerId !== currentMemberId) ??
    queue[0];
  return (
    <AdminShell>
      <div className="page-stack">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">REVIEW WORKSPACE / 10</p>
            <h1 className="page-title">审核工作台</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              核对每笔共同开销，让账目有据可查。
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
            独立审核 · 逐笔处理
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="待审核账目"
            value={
              <>
                {pending.length}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  笔
                </span>
              </>
            }
            caption="包含本人录入的待审账目"
            icon={Clock3}
          />
          <MetricCard
            label="可由我审核"
            value={
              <>
                {
                  pending.filter((item) => item.payerId !== currentMemberId)
                    .length
                }
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  笔
                </span>
              </>
            }
            caption="已排除本人录入的账目"
            icon={CheckCheck}
          />
          <MetricCard
            label="待审金额"
            value={
              <MoneyText
                cents={pending.reduce((total, item) => total + item.amount, 0)}
              />
            }
            caption="不计入正式预算与成员余额"
            icon={ShieldCheck}
          />
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <section className="soft-panel min-w-0">
            <div className="section-heading">
              <h2 className="section-title">待审核队列</h2>
              <span className="text-xs text-muted-foreground">
                {queue.length} 笔
              </span>
            </div>
            <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
              <div className="relative">
                <Label htmlFor="queue-search" className="sr-only">
                  搜索账目、成员或分类
                </Label>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="queue-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索账目、成员或分类"
                  className="pl-9"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full" aria-label="审核资格筛选">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部待审</SelectItem>
                  <SelectItem value="eligible">我可审核</SelectItem>
                  <SelectItem value="mine">本人录入</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {queue.length ? (
              <>
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>账目 / 录入人</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queue.map((item) => (
                        <TableRow
                          key={item.id}
                          data-state={
                            selected?.id === item.id ? "selected" : undefined
                          }
                          className={cn(
                            selected?.id === item.id && "bg-accent!",
                          )}
                        >
                          <TableCell className="whitespace-normal">
                            <p className="font-medium break-words">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {memberName(item.payerId)} · {item.date.slice(5)}
                              {item.payerId === currentMemberId && " · 本人"}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <MoneyText cents={item.amount} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-pressed={selected?.id === item.id}
                              aria-label={`查看${item.title}`}
                              onClick={() => setSelectedId(item.id)}
                            >
                              查看
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid gap-3 sm:hidden">
                  {queue.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      aria-pressed={selected?.id === item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "h-auto justify-between gap-2 whitespace-normal px-3 py-4 text-left",
                        selected?.id === item.id && "border-primary bg-accent",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <MemberAvatar id={item.payerId} />
                        <span className="min-w-0 break-words">
                          {item.title}
                        </span>
                      </span>
                      <MoneyText cents={item.amount} />
                    </Button>
                  ))}
                </div>
                <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                  不支持自审或批量审核。点击账目查看分摊与审核依据。
                </p>
              </>
            ) : (
              <EmptyState
                title="没有匹配的待审账目"
                description="尝试其他关键词或审核资格筛选。"
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                  >
                    清除筛选
                  </Button>
                }
              />
            )}
          </section>
          <div className="min-w-0">
            {selected ? (
              <ReviewDetail key={selected.id} transaction={selected} />
            ) : (
              <EmptyState
                title="暂无审核详情"
                description="队列中有账目时，可在这里逐笔查看与处理。"
              />
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
