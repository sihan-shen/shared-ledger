import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CheckCheck,
  CircleHelp,
  Component,
  Home,
  LayoutDashboard,
  Menu,
  Plus,
  RotateCcw,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useLedger } from "@/state/ledger";
import { cn } from "@/lib/utils";

const links = [
  { path: "/", label: "账本首页", short: "首页", icon: Home },
  { path: "/entry", label: "记一笔", short: "记账", icon: Plus },
  { path: "/review", label: "独立审核", short: "审核", icon: CheckCheck },
  { path: "/settlement", label: "结算与还款", short: "结算", icon: Wallet },
  {
    path: "/admin",
    label: "审核工作台",
    short: "工作台",
    icon: LayoutDashboard,
  },
  { path: "/design", label: "全部功能界面", short: "界面", icon: BookOpen },
  { path: "/components", label: "组件与规范", short: "组件", icon: Component },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="主导航" className="flex flex-col gap-1">
      {links.map(({ path, label, icon: Icon }, index) => (
        <NavLink
          key={path}
          to={path}
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex min-h-12 items-center gap-3 rounded-md px-3 text-base transition-colors",
              index === 4 && "mt-5 border-t pt-2",
              isActive
                ? "bg-accent font-semibold text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          <Icon aria-hidden="true" className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex min-h-11 items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <BookOpen aria-hidden="true" className="size-5" />
      </span>
      <div>
        <span className="text-lg font-semibold tracking-tight">共享账本</span>
        <span className="block text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
          SHARED LEDGER
        </span>
      </div>
    </Link>
  );
}

export function MobileShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[720px]">{children}</div>;
}
export function AdminShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1200px]">{children}</div>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, dispatch } = useLedger();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  const active = links.find((link) => link.path === location.pathname);
  const pending = state.transactions.filter(
    (item) => item.status === "pending",
  ).length;
  if (location.pathname === "/design/maintainer") {
    return <div className="min-h-dvh"><header className="flex items-center justify-between gap-4 border-b bg-card px-8 py-5"><Brand /><span className="text-sm text-muted-foreground">账号维护 · 独立工作区</span></header><main id="main-content" className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">{children}</main></div>;
  }
  if (location.pathname === "/design/login") {
    return <main id="main-content" className="mx-auto max-w-[520px] px-5 py-10">{children}</main>;
  }
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
        className="sr-only z-[100] rounded-md bg-card p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        跳到主要内容
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card px-5 py-7 lg:flex">
        <Brand />
        <div className="mb-6 mt-9 rounded-md border bg-background px-3 py-4">
          <p className="mb-2 text-xs text-muted-foreground">当前账本</p>
          <p className="font-semibold">周末生活账本</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            使用中 · 4 位成员
          </div>
        </div>
        <Navigation />
        <div className="mt-auto border-t pt-5">
          <div className="flex items-center gap-3">
            <MemberAvatar id="a" />
            <div>
              <p className="text-sm font-medium">成员A</p>
              <p className="text-xs text-muted-foreground">
                账本管理员 · 审核员
              </p>
            </div>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <CircleHelp aria-hidden="true" className="size-3.5" />
            本地原型 · 数据刷新后重置
          </p>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex min-h-19 items-center justify-between gap-3 border-b bg-card px-4 sm:px-8">
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <BookOpen aria-hidden="true" className="size-4" />
            <span>我的账本</span>
            <span className="mx-1">/</span>
            <span className="text-foreground">
              {active?.label ?? (location.pathname.startsWith("/design/") ? "功能界面" : "页面不存在")}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge
              variant="outline"
              className="hidden bg-accent text-primary sm:inline-flex"
            >
              SDS · 青绿
            </Badge>
            <ConfirmAction
              title="重置演示数据？"
              description="本次添加的账目和审核操作将被清除，恢复初始示例。"
              confirmLabel="重置数据"
              onConfirm={() => dispatch({ type: "reset" })}
              trigger={
                <Button size="icon" variant="ghost" aria-label="重置演示数据">
                  <RotateCcw aria-hidden="true" />
                </Button>
              }
            />
            <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
              <DialogTrigger asChild>
                <Button
                  className="lg:hidden"
                  variant="outline"
                  size="icon"
                  aria-label="打开导航菜单"
                >
                  <Menu aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>页面导航</DialogTitle>
                  <DialogDescription>
                    浏览业务页面和可复用组件。
                  </DialogDescription>
                </DialogHeader>
                <Navigation onNavigate={() => setMenuOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 px-4 pb-28 pt-6 outline-none sm:px-8 sm:pt-8 lg:pb-10"
        >
          {state.notice && (
            <div
              role="status"
              className="mx-auto mb-6 flex max-w-[1200px] items-start gap-3 rounded-md border border-primary/20 bg-accent p-4 text-sm text-accent-foreground"
            >
              <CheckCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0"
              />
              <span className="flex-1">{state.notice}</span>
              <Button
                aria-label="关闭提示"
                size="icon"
                variant="ghost"
                className="-my-2 -mr-2"
                onClick={() => dispatch({ type: "dismiss" })}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          )}
          {children}
          <footer className="mx-auto mt-10 flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs text-muted-foreground">
            <span>共享账本 / 周末生活账本</span>
            <Link
              to="/components"
              className="inline-flex min-h-11 items-center gap-1 hover:text-primary"
            >
              查看组件与规范
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          </footer>
        </main>
        <nav
          aria-label="移动端快捷导航"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-card px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          {links.slice(0, 4).map(({ path, short, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-18 flex-col items-center justify-center gap-1 text-xs",
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground",
                )
              }
            >
              <Icon aria-hidden="true" className="size-5" />
              <span>{short}</span>
              {path === "/review" && pending > 0 && (
                <span
                  aria-label={`${pending}笔待审核`}
                  className="absolute left-[56%] top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
                >
                  {pending}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
