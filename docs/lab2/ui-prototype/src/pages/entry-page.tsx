import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AllocationList } from "@/components/domain/allocation-list";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { MoneyText } from "@/components/domain/money-text";
import { MobileShell } from "@/layouts/app-shell";
import { currentMemberId, members, today } from "@/data/demo";
import { parseMoney, splitEqually } from "@/lib/money";
import { useLedger } from "@/state/ledger";

export function EntryPage() {
  const { dispatch } = useLedger();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("120.00");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("餐饮");
  const [date, setDate] = useState(today);
  const [selected, setSelected] = useState<string[]>(["a", "b", "c"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cents = parseMoney(amount);
  const allocations = splitEqually(
    cents ?? 0,
    members
      .filter((member) => selected.includes(member.id))
      .map((member) => member.id),
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (cents === null)
      nextErrors.amount = "请输入大于 0 的金额，最多 7 位整数和 2 位小数。";
    if (!title.trim()) nextErrors.title = "请填写账目说明。";
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
      nextErrors.date = "请选择有效的发生日期。";
    if (!selected.length) nextErrors.members = "请至少选择一位分摊成员。";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || cents === null) {
      requestAnimationFrame(() =>
        document.getElementById(Object.keys(nextErrors)[0])?.focus(),
      );
      return;
    }
    dispatch({
      type: "add",
      transaction: {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        amount: cents,
        payerId: currentMemberId,
        date,
        allocations,
        status: "pending",
      },
    });
    navigate("/");
  }

  function error(name: string) {
    return (
      errors[name] && (
        <p id={`${name}-error`} className="field-error">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {errors[name]}
        </p>
      )
    );
  }

  return (
    <MobileShell>
      <div className="page-stack">
        <div>
          <p className="eyebrow mb-2">NEW EXPENSE / 06</p>
          <h1 className="page-title">记一笔支出</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            记录共同开销，分清每个人的一份。
          </p>
        </div>
        <form onSubmit={submit} noValidate className="page-stack">
          <section className="soft-panel">
            <div className="field-stack">
              <Label htmlFor="amount">支出金额（元）</Label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-primary"
                >
                  ¥
                </span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  aria-invalid={!!errors.amount}
                  aria-describedby={
                    errors.amount ? "amount-error" : "amount-hint"
                  }
                  className="h-20 pl-12 text-3xl! font-semibold tabular-nums"
                />
              </div>
              <p id="amount-hint" className="text-xs text-muted-foreground">
                金额精确到分；平均分摊的尾差按成员顺序分配。
              </p>
              {error("amount")}
            </div>
          </section>
          <section className="soft-panel">
            <h2 className="section-title mb-5">账目信息</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field-stack">
                <Label htmlFor="date">发生日期</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "date-error" : undefined}
                />
                {error("date")}
              </div>
              <div className="field-stack">
                <Label htmlFor="category">支出分类</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["餐饮", "日用品", "交通", "娱乐", "其他"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="field-stack sm:col-span-2">
                <Label htmlFor="title">
                  账目说明 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="title"
                  value={title}
                  maxLength={120}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="例如：周末聚餐、公共日用品采购"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : "title-hint"}
                />
                <p id="title-hint" className="text-xs text-muted-foreground">
                  {title.length}/120 字
                </p>
                {error("title")}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 rounded-md bg-muted p-3">
              <span className="text-sm text-muted-foreground">垫付人</span>
              <div className="flex items-center gap-2">
                <MemberAvatar id="a" className="size-7" />
                <span className="text-sm">成员A（我）</span>
              </div>
            </div>
          </section>
          <section className="soft-panel">
            <div className="section-heading">
              <h2 className="section-title">谁来分摊</h2>
              <span className="text-sm text-primary">平均分摊</span>
            </div>
            <fieldset
              id="members"
              tabIndex={-1}
              aria-describedby={errors.members ? "members-error" : undefined}
            >
              <legend className="sr-only">选择参与分摊的成员</legend>
              <div className="grid grid-cols-2 gap-3">
                {members.map((member) => (
                  <label
                    key={member.id}
                    htmlFor={`member-${member.id}`}
                    className="flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
                  >
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selected.includes(member.id)}
                      onCheckedChange={(checked) =>
                        setSelected((items) =>
                          checked === true
                            ? [...items, member.id]
                            : items.filter((id) => id !== member.id),
                        )
                      }
                    />
                    <span>{member.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {error("members")}
            <div className="mb-3 mt-6 flex items-center justify-between text-sm">
              <h3 className="font-medium">分摊明细</h3>
              <span className="text-muted-foreground">
                {selected.length} 位成员
              </span>
            </div>
            {allocations.length > 0 && (
              <AllocationList allocations={allocations} />
            )}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">分摊合计</span>
              <div className="flex items-center gap-2">
                <MoneyText
                  cents={allocations.reduce(
                    (total, item) => total + item.cents,
                    0,
                  )}
                />
                {cents !== null && allocations.length > 0 && (
                  <CheckCircle2
                    aria-label="分摊金额已平衡"
                    className="size-4 text-primary"
                  />
                )}
              </div>
            </div>
          </section>
          <div className="flex gap-3 rounded-md bg-accent p-4 text-sm text-accent-foreground">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>
              提交后由其他合格审核员审核。通过前不影响预算、统计和成员余额。
            </p>
          </div>
          <Button type="submit" className="h-12 w-full">
            <Send aria-hidden="true" />
            提交审核
          </Button>
        </form>
      </div>
    </MobileShell>
  );
}
