import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { AppShell } from "@/layouts/app-shell";
import { HomePage } from "@/pages/home-page";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/domain/empty-state";

const EntryPage = lazy(() =>
  import("@/pages/entry-page").then((module) => ({
    default: module.EntryPage,
  })),
);
const ReviewPage = lazy(() =>
  import("@/pages/review-page").then((module) => ({
    default: module.ReviewPage,
  })),
);
const SettlementPage = lazy(() =>
  import("@/pages/settlement-page").then((module) => ({
    default: module.SettlementPage,
  })),
);
const AdminPage = lazy(() =>
  import("@/pages/admin-page").then((module) => ({
    default: module.AdminPage,
  })),
);
const ComponentsPage = lazy(() =>
  import("@/pages/components-page").then((module) => ({
    default: module.ComponentsPage,
  })),
);

const DesignPage = lazy(() => import("@/pages/design-pages").then(module => ({ default: module.DesignPage })));

export default function App() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <p role="status" className="py-12 text-center text-muted-foreground">
            正在打开页面…
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/entry" element={<EntryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/settlement" element={<SettlementPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/design/:screen" element={<DesignPage />} />
          <Route
            path="*"
            element={
              <EmptyState
                title="页面不存在"
                description="请从导航中选择页面，或回到账本首页。"
                action={
                  <Button asChild>
                    <Link to="/">返回首页</Link>
                  </Button>
                }
              />
            }
          />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
