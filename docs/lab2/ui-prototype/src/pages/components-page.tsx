import { useState, type ReactNode } from "react";
import {
  CheckCheck,
  CheckCircle2,
  Copy,
  Layers3,
  Plus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmAction } from "@/components/domain/confirm-action";
import { MoneyText } from "@/components/domain/money-text";
import { StatusBadge, type Status } from "@/components/domain/status-badge";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { AllocationList } from "@/components/domain/allocation-list";
import { EmptyState } from "@/components/domain/empty-state";
import { MetricCard } from "@/components/domain/metric-card";
import { TransactionRow } from "@/components/domain/transaction-row";
import { AdminShell } from "@/layouts/app-shell";
import { useLedger } from "@/state/ledger";

function ComponentSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="soft-panel">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-accent text-xs font-semibold text-primary">
          {number}
        </span>
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function ComponentsPage() {
  const { state } = useLedger();
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("餐饮");
  const [checked, setChecked] = useState(true);
  const [progress, setProgress] = useState(45);
  return (
    <AdminShell>
      <div className="page-stack">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">COMPONENT LIBRARY</p>
            <h1 className="page-title">组件与规范</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              一套视觉语言，贯穿每个页面。以 shadcn/ui 为基础，沿用 SDS
              青绿主题；业务组件共享金额、状态与成员信息的表达方式。
            </p>
          </div>
          <Badge variant="outline" className="bg-card py-2">
            <Layers3 aria-hidden="true" className="size-4 text-primary" />
            本地组件套装 v0.1
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "品牌色", value: "青绿 · #0F766E" },
            { label: "圆角 / 边框", value: "8px / 1px" },
            { label: "正文 / 触控", value: "16px / ≥44px" },
            { label: "表面层次", value: "边框与留白 · 无阴影" },
          ].map((item) => (
            <div className="rounded-md border bg-card p-4" key={item.label}>
              <p className="mb-2 text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <div role="status" className="min-h-6 text-sm text-primary">
          {feedback || "点击组件，查看交互反馈。"}
        </div>
        <Tabs defaultValue="foundations">
          <TabsList
            className="mb-6 h-auto w-full justify-start sm:w-auto"
            aria-label="组件分类"
          >
            <TabsTrigger value="foundations" className="flex-1 sm:flex-none">
              基础组件
            </TabsTrigger>
            <TabsTrigger value="domain" className="flex-1 sm:flex-none">
              业务组件
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex-1 sm:flex-none">
              视觉规范
            </TabsTrigger>
          </TabsList>
          <TabsContent value="foundations" className="page-stack">
            <ComponentSection
              number="01"
              title="按钮 Button"
              description="主操作、次操作与风险操作保持一致的层级；支持键盘焦点与禁用状态。"
            >
              <div className="flex flex-wrap gap-3">
                {[
                  { variant: "default", label: "主要操作" },
                  { variant: "outline", label: "描边按钮" },
                  { variant: "secondary", label: "次要操作" },
                  { variant: "ghost", label: "轻量操作" },
                  { variant: "destructive", label: "风险操作" },
                ].map(({ variant, label }) => (
                  <Button
                    key={variant}
                    variant={
                      variant as
                        | "default"
                        | "outline"
                        | "secondary"
                        | "ghost"
                        | "destructive"
                    }
                    onClick={() => setFeedback(`你点击了“${label}”。`)}
                  >
                    {label}
                  </Button>
                ))}
                <Button disabled>暂不可用</Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="添加示例"
                  onClick={() => setFeedback("已触发添加示例操作。")}
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
            </ComponentSection>
            <ComponentSection
              number="02"
              title="表单 Form controls"
              description="输入框和选择器正文为 16px；标签、错误说明和可操作区域统一。"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="field-stack">
                  <Label htmlFor="kit-name">账本名称</Label>
                  <Input id="kit-name" placeholder="输入一个好记的名称" />
                </div>
                <div className="field-stack">
                  <Label htmlFor="kit-category">支出分类</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="kit-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["餐饮", "日用品", "交通"].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-stack">
                  <Label htmlFor="kit-error">错误状态示例</Label>
                  <Input
                    id="kit-error"
                    aria-invalid="true"
                    aria-describedby="kit-error-text"
                    placeholder="请填写金额"
                  />
                  <p id="kit-error-text" className="text-sm text-destructive">
                    请输入大于 0 的金额。
                  </p>
                </div>
                <div className="field-stack">
                  <Label htmlFor="kit-disabled">只读流程中的禁用状态</Label>
                  <Input
                    id="kit-disabled"
                    disabled
                    value="归档账本暂不可编辑"
                  />
                </div>
                <div className="field-stack md:col-span-2">
                  <Label htmlFor="kit-note">备注</Label>
                  <Textarea
                    id="kit-note"
                    placeholder="补充这笔共同开销的说明"
                  />
                </div>
              </div>
              <label
                htmlFor="kit-checkbox"
                className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-3"
              >
                <Checkbox
                  id="kit-checkbox"
                  checked={checked}
                  onCheckedChange={(value) => setChecked(value === true)}
                />
                <span>参与本次分摊</span>
              </label>
            </ComponentSection>
            <div className="grid items-start gap-6 md:grid-cols-2">
              <ComponentSection
                number="03"
                title="确认弹窗 Dialog"
                description="由 Radix 处理焦点、键盘及模态交互，组合为可复用的确认操作。"
              >
                <ConfirmAction
                  title="确认示例操作？"
                  description="这是组件展示，不会修改账本或发送请求。"
                  confirmLabel="确认示例"
                  onConfirm={() => setFeedback("确认弹窗已完成示例操作。")}
                  trigger={
                    <Button variant="outline">
                      <Copy aria-hidden="true" />
                      打开确认弹窗
                    </Button>
                  }
                />
              </ComponentSection>
              <ComponentSection
                number="04"
                title="进度 Progress"
                description="预算进度以主题色显示，同时保留数字说明。"
              >
                <Label htmlFor="kit-progress">预算使用比例：{progress}%</Label>
                <Input
                  className="my-2 border-0 p-0 accent-primary"
                  id="kit-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) => setProgress(Number(event.target.value))}
                />
                <Progress
                  value={progress}
                  aria-label={`预算已使用 ${progress}%`}
                />
              </ComponentSection>
            </div>
            <ComponentSection
              number="05"
              title="卡片与表格 Card / Table"
              description="表面通过边框与留白区分层级；表格正文保持可读字号。"
            >
              <div className="grid items-start gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>周末生活账本</CardTitle>
                    <CardDescription>4 位成员 · 使用中</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      本月预算
                    </span>
                    <MoneyText cents={150000} />
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>成员</TableHead>
                      <TableHead className="text-right">分摊金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["A", "B", "C"].map((name) => (
                      <TableRow key={name}>
                        <TableCell>成员{name}</TableCell>
                        <TableCell className="text-right">
                          <MoneyText cents={4000} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ComponentSection>
          </TabsContent>
          <TabsContent value="domain" className="page-stack">
            <ComponentSection
              number="01"
              title="金额与状态 MoneyText / StatusBadge"
              description="金额以整数分传入，统一格式化；状态同时使用文字、图标和颜色。"
            >
              <div className="mb-6 flex flex-wrap gap-6 text-2xl">
                <MoneyText cents={12000} signed className="text-primary" />
                <MoneyText cents={-8000} signed />
                <MoneyText cents={0} />
              </div>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "pending",
                    "approved",
                    "rejected",
                    "awaiting",
                    "confirmed",
                    "revoked",
                  ] as Status[]
                ).map((status) => (
                  <StatusBadge key={status} status={status} />
                ))}
              </div>
            </ComponentSection>
            <div className="grid items-start gap-6 md:grid-cols-2">
              <ComponentSection
                number="02"
                title="分摊明细 AllocationList"
                description="录入、审核和展示页共用同一组件与成员表达。"
              >
                <AllocationList
                  allocations={[
                    { memberId: "a", cents: 4000 },
                    { memberId: "b", cents: 4000 },
                    { memberId: "c", cents: 4000 },
                  ]}
                />
              </ComponentSection>
              <ComponentSection
                number="03"
                title="成员 MemberAvatar"
                description="使用匿名成员和首字母；名称与颜色保持跨页面一致。"
              >
                <div className="mb-6 flex gap-3">
                  {["a", "b", "c", "d"].map((id) => (
                    <MemberAvatar key={id} id={id} />
                  ))}
                </div>
                <MetricCard
                  label="我的应收"
                  value={<MoneyText cents={12000} />}
                  caption="正数表示应收，负数表示应付"
                  icon={Wallet}
                />
              </ComponentSection>
            </div>
            <ComponentSection
              number="04"
              title="账目列表 TransactionRow"
              description="分类、垫付人、日期、金额和状态保持固定信息层级。"
            >
              <div className="divide-y">
                {state.transactions.slice(0, 2).map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </ComponentSection>
            <ComponentSection
              number="05"
              title="空状态 EmptyState"
              description="解释为什么没有内容，并提供清晰的后续操作。"
            >
              <EmptyState
                title="待审核账目已处理完毕"
                description="新账目提交后会出现在这里。"
                action={
                  <Button
                    variant="outline"
                    onClick={() => setFeedback("空状态操作已触发。")}
                  >
                    <CheckCheck aria-hidden="true" />
                    知道了
                  </Button>
                }
              />
            </ComponentSection>
          </TabsContent>
          <TabsContent value="tokens" className="page-stack">
            <ComponentSection
              number="01"
              title="色彩 Color"
              description="shadcn 的 primary、accent、border 等语义变量都映射到已有 SDS tokens。"
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: "品牌主色",
                    token: "--sds-color-brand",
                    value: "#0F766E",
                  },
                  {
                    label: "品牌悬停",
                    token: "--sds-color-brand-hover",
                    value: "#115E59",
                  },
                  {
                    label: "品牌浅底",
                    token: "--sds-color-brand-soft",
                    value: "#F0FDFA",
                  },
                  {
                    label: "辅助青绿",
                    token: "--sds-color-brand-500",
                    value: "#14B8A6",
                  },
                  {
                    label: "正文",
                    token: "--sds-color-text-primary",
                    value: "#111111",
                  },
                  {
                    label: "边框",
                    token: "--sds-color-border",
                    value: "#E6E6E6",
                  },
                  {
                    label: "待处理",
                    token: "--sds-color-state-pending",
                    value: "#D97706",
                  },
                  {
                    label: "风险",
                    token: "--sds-color-state-danger",
                    value: "#DC2626",
                  },
                ].map((item) => (
                  <div
                    key={item.token}
                    className="overflow-hidden rounded-md border"
                  >
                    <div
                      className="h-20 border-b"
                      style={{ backgroundColor: `var(${item.token})` }}
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ComponentSection>
            <ComponentSection
              number="02"
              title="字体 Typography"
              description="使用本机 Inter / Noto Sans 中文字体；无外部字体请求。未安装时使用系统 sans-serif。"
            >
              <div className="grid gap-5">
                <p className="text-[32px] leading-10 font-semibold">
                  清楚记录，共同生活
                </p>
                <p className="text-2xl leading-8 font-semibold">
                  标题二 · 24 / 32
                </p>
                <p className="text-xl leading-7 font-semibold">
                  标题三 · 20 / 28
                </p>
                <p>正文 · 16 / 24 · 每一笔收支都有清晰的依据。</p>
                <p className="text-sm text-muted-foreground">
                  辅助信息 · 14 / 20
                </p>
                <p className="text-xs text-muted-foreground">
                  说明文字 · 12 / 18
                </p>
              </div>
            </ComponentSection>
            <ComponentSection
              number="03"
              title="组件分层"
              description="主题决定视觉，基础组件处理通用交互，业务组件组织领域信息，页面负责组合。"
            >
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  ["01", "tokens / theme", "现有 SDS 变量 → shadcn 语义别名"],
                  ["02", "components/ui", "官方基础件，不引用账本数据"],
                  [
                    "03",
                    "components/domain",
                    "金额、状态、分摊、审核与确认操作",
                  ],
                  ["04", "pages / layouts", "页面组合与移动、管理端布局"],
                ].map(([number, title, detail]) => (
                  <li key={number} className="rounded-md border p-4">
                    <span className="text-xs text-primary">{number}</span>
                    <h3 className="mt-2 font-mono text-sm font-semibold">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {detail}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 flex items-start gap-2 text-sm text-primary">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                修改既有 sds-theme.css，即可统一更新消费这些语义变量的组件。
              </p>
            </ComponentSection>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}
