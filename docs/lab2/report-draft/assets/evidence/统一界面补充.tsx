import { useId, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Copy, Plus, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { AllocationList } from "@/components/domain/allocation-list";
import { MemberAvatar } from "@/components/domain/member-avatar";
import { MoneyText } from "@/components/domain/money-text";
import { StatusBadge } from "@/components/domain/status-badge";
import { MobileShell, AdminShell } from "@/layouts/app-shell";
import { members } from "@/data/demo";
import { useLedger } from "@/state/ledger";

export const designScreens = [
  ["login", "登录与首次改密", "/design/login"],
  ["ledgers", "账本列表", "/design/ledgers"],
  ["home", "账本首页", "/"],
  ["members", "成员与邀请", "/design/members"],
  ["invite", "邀请加入", "/design/invite"],
  ["entry", "支出录入", "/entry"],
  ["income", "收入录入", "/design/income"],
  ["transactions", "账目列表", "/design/transactions"],
  ["detail", "账目详情", "/design/detail"],
  ["admin", "管理审核工作台", "/admin"],
  ["review", "移动审核详情", "/review"],
  ["correction", "更正与作废", "/design/correction"],
  ["budget", "预算与统计", "/design/budget"],
  ["settlement", "结算与还款", "/settlement"],
  ["logs", "操作日志", "/design/logs"],
  ["settings", "设置与归档", "/design/settings"],
  ["maintainer", "账号维护", "/design/maintainer"],
] as const;

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="soft-panel"><h2 className="section-title mb-5">{title}</h2>{children}</section>;
}
function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  const id = useId();
  return <div className="field-stack"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} defaultValue={value} /></div>;
}
function Note({ children }: { children: ReactNode }) {
  return <div className="rounded-md border border-primary/20 bg-accent p-4 text-sm leading-relaxed text-accent-foreground">{children}</div>;
}
function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b py-4 last:border-0"><span className="text-muted-foreground">{label}</span><div>{children}</div></div>;
}
function SelectField({ label, options }: { label: string; options: string[] }) {
  const id = useId();
  return <div className="field-stack"><Label htmlFor={id}>{label}</Label><select id={id} className="min-h-11 w-full rounded-md border bg-card px-3 text-base">{options.map(v => <option key={v}>{v}</option>)}</select></div>;
}

export function DesignIndex() {
  return <AdminShell><div className="page-stack"><div><p className="eyebrow mb-2">SCREEN LIBRARY</p><h1 className="page-title">全部功能界面</h1></div><p className="text-muted-foreground">共享 SDS tokens、shadcn/ui 基础件和业务组件。</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{designScreens.map(([key, label, path], i) => <Link key={key} to={path} className="soft-panel flex items-center justify-between gap-3 hover:border-primary"><span><span className="eyebrow block mb-2">{String(i + 1).padStart(2, "0")}</span>{label}</span><ArrowRight className="size-5 text-primary" /></Link>)}</div></div></AdminShell>;
}

export function DesignPage() {
  const { screen } = useParams();
  const { state } = useLedger();
  const [notice, setNotice] = useState("");
  const [firstLogin, setFirstLogin] = useState(false);
  const [filter, setFilter] = useState("");
  const selected = designScreens.find(([key]) => key === screen);
  const wide = ["members", "correction", "budget", "logs", "settings", "maintainer"].includes(screen ?? "");
  const Shell = wide ? AdminShell : MobileShell;
  const tell = (text: string) => setNotice(text);
  let content: ReactNode;
  switch (screen) {
    case "login": content = <Panel title={firstLogin ? "首次登录 · 设置新密码" : "欢迎回来"}><div className="mb-6 flex items-center gap-3 text-primary"><BookOpen className="size-8" /><span className="text-xl font-semibold">共享账本</span></div><div className="grid gap-5"><Field label="账号" value="member_a" />{firstLogin ? <><Field label="新密码" value="" type="password" /><Field label="确认新密码" value="" type="password" /><Note>首次登录或凭据重置后，请设置新密码再进入账本。</Note></> : <><Field label="密码" value="" type="password" /><p className="text-sm text-muted-foreground">账号由维护人员开通。连续第五次失败起暂停登录15分钟。</p></>}<Button onClick={() => firstLogin ? tell("新密码表单已确认") : setFirstLogin(true)}>{firstLogin ? "保存新密码" : "登录"}<ArrowRight /></Button><p className="text-sm text-muted-foreground">无法登录？请通过原登记渠道联系维护人员核验。</p></div></Panel>; break;
    case "ledgers": content = <><Button className="self-start" onClick={() => tell("创建账本表单已打开：填写账本名称及说明")}><Plus />创建账本</Button>{[["周末生活账本", "使用中", "4 位成员 · 管理员 / 审核员", "+¥120.00"], ["旅行公共开销", "使用中", "3 位成员 · 普通成员", "¥0.00"], ["暑期露营", "已归档", "4 位成员 · 只读历史", "¥0.00"]].map(([name, status, role, balance]) => <Link to="/" key={name} className="soft-panel"><div className="flex items-center justify-between gap-3"><h2 className="section-title">{name}</h2><Badge variant="outline">{status}</Badge></div><p className="my-4 text-sm text-muted-foreground">{role}</p><div className="flex items-center justify-between"><span className="text-primary">本人净余额 {balance}</span><ChevronRight className="size-5" /></div></Link>)}</>; break;
    case "members": content = <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><Panel title="账本成员 · 4人"><div className="divide-y">{members.map((m, i) => <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><MemberAvatar id={m.id} /><div><p className="font-medium">{m.name}{i === 0 && "（我）"}</p><p className="mt-1 text-xs text-muted-foreground">加入顺序 {i + 1} · 在册</p></div></div><div className="flex flex-wrap gap-2"><Badge variant="outline">{m.role}</Badge>{i === 0 && <Badge variant="outline">审核员</Badge>}</div></div>)}</div><Note>管理员与审核员可以兼任，分别授予和撤销。移除成员前核对余额及未结事项。</Note></Panel><Panel title="邀请成员"><p className="mb-5 text-muted-foreground">通过链接加入此账本，默认授予普通成员身份。</p><Label>邀请链接</Label><Input className="mt-2 mb-4" value="https://ledger.example/join/K7M2" readOnly /><div className="mb-5 flex flex-wrap gap-3"><Button onClick={() => tell("邀请链接已准备好复制")}><Copy />复制链接</Button><Button variant="outline" onClick={() => tell("当前邀请已撤销")}>撤销邀请</Button></div><Row label="有效期">7 天</Row><Row label="可用次数">1 次</Row><Note>成功加入即失效；在册成员重复打开不消耗邀请。重新加入保留历史与加入顺序。</Note></Panel></div>; break;
    case "invite": content = <Panel title="你收到一份账本邀请"><div className="my-6 flex size-14 items-center justify-center rounded-md bg-accent text-primary"><BookOpen /></div><h2 className="text-xl font-semibold">周末生活账本</h2><p className="mt-3 mb-6 text-muted-foreground">邀请人：成员A · 4 位在册成员</p><Row label="加入身份">普通成员</Row><Row label="邀请状态"><Badge variant="outline">有效 · 可使用1次</Badge></Row><Note>当前登录 member_d。确认后加入此账本，不自动获得管理员或审核员权限。</Note><Button className="mt-6 w-full" onClick={() => tell("已确认加入周末生活账本")}>确认加入账本</Button><Button asChild variant="ghost" className="mt-2 w-full"><Link to="/design/ledgers">返回我的账本</Link></Button></Panel>; break;
    case "income": content = <><Note>收入审核通过后计入余额与收入统计，不占用支出预算。</Note><Panel title="收入信息"><div className="grid gap-5"><Field label="收入金额（元）" value="120.00" type="number" /><div className="grid gap-4 sm:grid-cols-2"><Field label="发生日期" value="2026-10-29" type="date" /><SelectField label="收入分类" options={["公共补贴", "利息", "其他收入"]} /></div><SelectField label="收款人" options={members.map(m => m.name)} /><Field label="说明" value="公共活动补贴" /><SelectField label="分配方式" options={["平均分配", "指定金额分配"]} /></div></Panel><Panel title="受益成员与分配预览"><AllocationList allocations={members.map(m => ({ memberId: m.id, cents: 3000 }))} /><p className="mt-4 text-sm text-muted-foreground">4 人合计 ¥120.00，分配金额与收入一致。</p></Panel><div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => tell("收入草稿已保存")}>保存草稿</Button><Button className="flex-1" onClick={() => tell("收入已提交审核，审核前不计入余额")}>提交审核</Button></div></>; break;
    case "transactions": content = <><div className="soft-panel grid gap-4"><div className="relative"><Search className="absolute left-3 top-3 size-5 text-muted-foreground" /><Input className="pl-10" aria-label="搜索账目" placeholder="搜索说明、分类或成员" value={filter} onChange={e => setFilter(e.target.value)} /></div><div className="grid grid-cols-2 gap-3"><SelectField label="账目类型" options={["全部收支", "支出", "收入"]} /><SelectField label="状态" options={["全部状态", "已审核", "待审核", "已驳回"]} /><Field label="起始日期" value="2026-10-01" type="date" /><Field label="最低金额（元）" value="0.00" type="number" /></div></div><Panel title="账目记录">{state.transactions.filter(t => `${t.title}${t.category}`.includes(filter)).map(t => <Link to="/design/detail" key={t.id} className="flex items-center justify-between gap-3 border-b py-4 last:border-0"><div><p className="font-medium">{t.title}</p><p className="my-2 text-xs text-muted-foreground">{t.date} · {t.category}</p><StatusBadge status={t.status} /></div><MoneyText cents={t.amount} /></Link>)}</Panel></>; break;
    case "detail": content = <><Panel title="超市采购"><div className="mb-5 flex items-center justify-between"><MoneyText cents={8600} className="text-3xl font-semibold" /><StatusBadge status="approved" /></div><Row label="发生日期">2026-10-28</Row><Row label="分类">日用品</Row><Row label="付款人 / 录入人">成员A / 成员A</Row><Row label="当前生效版本">V1</Row><Row label="审核人">成员C</Row><Row label="审核意见">金额与分摊核对一致</Row></Panel><Panel title="分摊明细"><AllocationList allocations={members.map(m => ({ memberId: m.id, cents: 2150 }))} /></Panel><Note>已审核账目保留版本。更正通过前原版本继续有效，作废通过后退出正式计算。</Note><Button asChild><Link to="/design/correction">申请更正 / 作废</Link></Button></>; break;
    case "correction": content = <div className="grid gap-6 xl:grid-cols-2"><Panel title="原记录 · 当前生效 V1"><Row label="账目">超市采购</Row><Row label="原金额"><MoneyText cents={8600} /></Row><Row label="发生日期">2026-10-28</Row><Row label="版本录入人">成员A</Row><div className="mt-5"><AllocationList allocations={members.map(m => ({ memberId: m.id, cents: 2150 }))} /></div></Panel><Panel title="申请更正"><div className="grid gap-5"><SelectField label="申请类型" options={["更正原支出", "作废原支出"]} /><Field label="正确金额（元）" value="80.00" type="number" /><div className="field-stack"><Label htmlFor="reason">申请原因（必填）</Label><Textarea id="reason" defaultValue="商家退回6元，按实际支出更正原记录。" /></div><Note>拟更正为每人 ¥20.00。通过后回算发生月预算和成员余额；处理人不得是申请人或原版本录入人。</Note><Button onClick={() => tell("更正申请已提交，原V1在处理前继续有效")}>提交申请</Button></div></Panel></div>; break;
    case "budget": content = <><div className="grid gap-4 md:grid-cols-3">{[["本月预算", "¥1,000.00"], ["已审核支出", "¥680.00"], ["预算剩余", "¥320.00"]].map(([label, value]) => <div className="soft-panel" key={label}><p className="mb-3 text-sm text-muted-foreground">{label}</p><p className="text-3xl font-semibold">{value}</p></div>)}</div><div className="grid gap-6 xl:grid-cols-2"><Panel title="2026年10月预算"><Progress value={68} /><p className="my-5 text-muted-foreground">使用率 68% · 待审核支出单独列示，不计入已用额。</p><Field label="月度预算（元）" value="1000.00" type="number" /><Button className="mt-4" onClick={() => tell("月预算额度已保存")}>保存预算</Button><p className="mt-4 text-sm text-muted-foreground">超支仅提示，不阻止录入、提交和审核。</p></Panel><Panel title="支出分类统计">{[["餐饮", 36000], ["日用品", 20000], ["交通", 12000]].map(([label, value]) => <div key={label} className="mb-5"><div className="mb-2 flex justify-between"><span>{label}</span><MoneyText cents={Number(value)} /></div><Progress value={Number(value) / 680} /></div>)}<p className="text-sm text-muted-foreground">口径：发生于本月且当前生效的已审核支出。收入单列，不抵减支出预算。</p></Panel></div><Panel title="成员承担与净余额"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{members.map(m => <div key={m.id} className="rounded-md border p-4"><div className="mb-4 flex items-center gap-3"><MemberAvatar id={m.id} />{m.name}</div><p className="text-xs text-muted-foreground mb-2">当前净余额</p><MoneyText cents={state.balances[m.id]} signed /></div>)}</div></Panel></>; break;
    case "logs": content = <><div className="soft-panel grid gap-4 sm:grid-cols-3"><SelectField label="操作者" options={["全部成员", ...members.map(m => m.name)]} /><SelectField label="操作类型" options={["全部操作", "审核", "还款", "角色变更"]} /><Field label="起始日期" value="2026-10-01" type="date" /></div><Panel title="操作记录"><div className="divide-y">{[["10-29 14:32", "成员C", "审核通过", "超市采购 · t-1 / V1", "待审核 → 已审核", "金额与分摊核对一致"], ["10-29 13:10", "成员B", "登记还款", "还款 p-1 · B → A", "待确认 ¥50.00", "实际到账后由成员A确认"], ["10-28 18:00", "成员A", "授予角色", "成员C · 审核员", "无 → 审核员", "独立审核安排"]].map(([time, actor, action, obj, change, reason]) => <div key={time} className="grid gap-3 py-5 lg:grid-cols-[130px_1fr_1fr]"><div className="text-sm text-muted-foreground">2026-{time}<p className="mt-2">{actor}</p></div><div><Badge variant="outline">{action}</Badge><p className="mt-3 font-medium">{obj}</p></div><div><p>{change}</p><p className="mt-2 text-sm text-muted-foreground">原因：{reason}</p></div></div>)}</div><Note>日志沿用原业务可见范围；自动撤销记录关联触发操作与还款标识。</Note></Panel></>; break;
    case "settings": content = <div className="grid gap-6 xl:grid-cols-2"><Panel title="账本设置"><div className="grid gap-5"><Field label="账本名称" value="周末生活账本" /><Field label="账本说明" value="聚餐、日用品与出行公共开销" /><Button className="justify-self-start" onClick={() => tell("账本设置已保存")}>保存设置</Button></div><h3 className="section-title mt-8 mb-4">支出分类</h3><div className="flex flex-wrap gap-3">{["餐饮", "日用品", "交通", "其他"].map(t => <Badge variant="outline" key={t}>{t}</Badge>)}</div><Button variant="outline" className="mt-5" onClick={() => tell("新增分类表单已打开")}><Plus />添加分类</Button></Panel><Panel title="归档检查"><Badge variant="outline" className="mb-4">使用中</Badge>{[["成员净余额全部为零", false], ["无待审核收支", false], ["无待处理更正 / 作废", true], ["无待确认还款与纠错", false]].map(([label, ok]) => <div key={String(label)} className="flex items-center justify-between gap-3 border-b py-4"><span>{label}</span><span className={ok ? "text-primary" : "text-muted-foreground"}>{ok ? "已满足" : "未满足"}</span></div>)}<Button disabled className="mt-6 w-full">结清未结事项后归档</Button><p className="mt-4 text-sm text-muted-foreground">归档冻结写入并保留历史，管理员可重新开启。有历史记录的账本不可直接删除。</p></Panel></div>; break;
    case "maintainer": content = <><Note><ShieldCheck className="mb-2 size-5" />账号维护专用。维护身份不自动获得账本业务数据访问权；不展示明文密码。</Note><div className="grid gap-6 xl:grid-cols-2"><Panel title="名单开通与领用"><div className="grid gap-5"><Field label="账号标识" value="member_e" /><Field label="登记交付渠道" value="课程登记邮箱（已脱敏）" /><SelectField label="身份核验" options={["已通过原登记渠道核验", "需人工复核"]} /><label className="flex items-start gap-3"><Checkbox defaultChecked /><span>首次登录强制设置新密码</span></label><Button onClick={() => tell("账号开通申请已确认，凭据通过登记渠道交付")}>开通并登记交付</Button></div></Panel><Panel title="凭据重置"><div className="grid gap-5"><Field label="待重置账号" value="member_b" /><SelectField label="核验结论" options={["等待原登记渠道核验", "核验通过", "转人工复核"]} /><Note>核验通过后生成一次性初始凭据，经登记渠道交付；下次登录必须改密。</Note><Button variant="outline" disabled>完成身份核验后重置</Button></div></Panel></div><Panel title="维护审计"><Row label="最近开通">member_d · 已交付 · 强制改密</Row><Row label="最近重置">member_b · 核验中 · 未生成凭据</Row><Row label="日志范围">账号维护操作与交付结果</Row></Panel></>; break;
    default: return <DesignIndex />;
  }
  return <Shell><div className="page-stack"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow mb-2">SHARED LEDGER / {String(designScreens.findIndex(([key]) => key === screen) + 1).padStart(2, "0")}</p><h1 className="page-title">{selected?.[1]}</h1></div><Button asChild variant="ghost" size="sm"><Link to="/design">全部界面<ChevronRight className="size-4" /></Link></Button></div>{notice && <Note><CheckCircle2 className="inline size-4 mr-2" />{notice}</Note>}{content}</div></Shell>;
}
