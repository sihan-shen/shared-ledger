# React + shadcn/ui + SDS 操作指南（2026-10-29）

> 适用：实验二 UI 设计 + 实验三 React 实现。  
> 权威技术决策：[方案草稿.md](方案草稿.md)。  
> 本指南按官方文档的“变量优先、复制 Kit、本地实现”整理；不依赖旧 Vue/Element Plus/Vant 记忆。

---

## 当前入口：本地组件化原型

用户已选择本地 shadcn/ui 方案，保持 SDS + 青绿视觉。进入 `docs/lab2/ui-prototype/`，执行 `npm ci`、`npm run dev`。完整入口、页面清单、目录边界和演示限制见 [README](ui-prototype/README.md)。

- 先访问 `#/components` 查看真实可交互组件与视觉规范，再组合页面。
- `components/ui`：官方 shadcn 源码；`components/domain`：金额、状态、成员、分摊、审核等业务组件。
- `styles/theme.css` 直接导入既有 SDS CSS，并映射 shadcn 语义变量；不用复制 tokens 或依赖 Figma Variables。
- 新增组件保持现有 `components.json` 与主题，不重新 init 覆盖已有映射。
- 本地原型使用 npm 锁文件和内存示例；下方 pnpm、完整 API 栈与 Figma 步骤属于早期完整应用/设计工具参考，并非本原型启动前置条件。
- 按用户要求，本轮不添加测试；验证为类型检查、构建和浏览器人工检查，不做哈希检查。

## 0. 先确认现状

| 项 | 当前决定 |
| --- | --- |
| 视觉规范 | Simple Design System（SDS），Figma 旧稿保留；当前设计在本地 React 原型进行 |
| 品牌色 | 青绿 `#0F766E` / `#115E59` / `#14B8A6` / `#F0FDFA`，不采用 SDS 默认黑白 brand |
| 视觉形 | SDS：8px 圆角、1px 边框、Inter、无卡片阴影 |
| 前端 | React 19 + TypeScript + Vite |
| UI 实现 | shadcn/ui（Radix）+ Tailwind CSS 4 + CVA，沿用共享 SDS tokens |
| 后端 | FastAPI + PostgreSQL，不变 |
| 变量导入 | 截止 2026-10-26，Figma 原生 JSON 导入未在官方 Variables 文档中提供；用 Tokens Studio / DTCG 插件 |

---

## 1. 官方文档索引

### Figma

- Variables 总览：https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes
- 创建/管理 Variables：https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables-and-collections
- 应用 Variables：https://help.figma.com/hc/en-us/articles/15343107263511-Apply-variables-to-designs
- Modes：https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables
- Simple Design System：https://www.figma.com/community/file/1380235722331273046/simple-design-system
- SDS GitHub：https://github.com/figma/sds
- SDS Storybook：https://figma.github.io/sds/storybook

### React / 工程

- React：https://react.dev/learn
- Vite：https://vite.dev/guide/
- React Router：https://reactrouter.com/
- TanStack Query：https://tanstack.com/query/latest/docs/framework/react/overview
- Tailwind CSS：https://tailwindcss.com/docs/installation
- Radix UI：https://www.radix-ui.com/primitives/docs/overview/introduction
- React Hook Form：https://react-hook-form.com/
- Zod：https://zod.dev/
- TanStack Table：https://tanstack.com/table/latest
- openapi-typescript：https://openapi-ts.dev/

---

# 第一部分：Figma（SDS + 青绿）

## 2. 复制 SDS，而不是 Save Library

Figma 的 Library 变量是只读的。直接 `Save` SDS 只能使用默认色，不能改 `background-brand-default`。

正确流程：

1. 打开 [Simple Design System](https://www.figma.com/community/file/1380235722331273046/simple-design-system)。
2. 点 **Duplicate** / **Make a copy**（不同版本文案不同）。
3. 复制到 Drafts，命名 `KIT_SDS_Teal`。
4. Move to project。
5. 删除 SDS 的演示页面，保留 `Foundations`、`Components`。

> 免费版：复制 + 本地 Variables 可做；发布跨文件 Library / 多 Mode 需付费或 Education。课程项目直接在这个副本里设计，不发布 Library。

## 3. 建页面

```text
00_Cover
01_Tokens
02_Components
03_Mobile
04_Admin
05_Export
```

- `01_Tokens`：放颜色/字号说明，不放大段正文。
- `02_Components`：Button、Input、Select、Checkbox、Tag、Table、Dialog、Card。
- `03_Mobile`：390×844 主稿；360/768 只做检查 frame。
- `04_Admin`：1440×900。
- `05_Export`：导出用 frame，隐藏参考层。

## 4. 改变量：先 primitive，再 semantic

SDS 的链路：

```text
color.brand.100–1000（primitive）
        ↓ alias
background-brand-default / text-brand-default / border-brand-default（semantic）
        ↓ 组件引用
Button / Card / Input / Tag
```

先改 `brand` ramp：

| primitive | 值 |
| --- | --- |
| `brand-100` | `#F0FDFA` |
| `brand-200` | `#CCFBF1` |
| `brand-300` | `#99F6E4` |
| `brand-400` | `#5EEAD4` |
| `brand-500` | `#2DD4BF` |
| `brand-600` | `#14B8A6` |
| `brand-700` | `#0F766E` |
| `brand-800` | `#115E59` |
| `brand-900` | `#134E4A` |
| `brand-1000` | `#042F2E` |

再检查 semantic：

| semantic | 值 |
| --- | --- |
| `background-brand-default` | `#0F766E` |
| `background-brand-hover` | `#115E59` |
| `background-brand-secondary` | `#F0FDFA` |
| `text-brand-default` | `#0F766E` |
| `text-brand-secondary` | `#115E59` |
| `border-brand-default` | `#0F766E` |
| `background-default-default` | `#FFFFFF` |
| `background-default-secondary` | `#FAFAFA` |
| `background-default-tertiary` | `#F5F5F5` |
| `text-default-default` | `#111111` |
| `text-default-secondary` | `#444444` |
| `text-default-tertiary` | `#757575` |
| `border-default-default` | `#E6E6E6` |
| `background-success-default` | `#16A34A` |
| `background-warning-default` | `#D97706` |
| `background-danger-default` | `#DC2626` |
| `background-info-default` | `#0284C7` |

完整改色清单：[SDS变量改色.csv](SDS变量改色.csv)。

**不要**逐个按钮/卡片改 Fill。变量如果存在 alias，改上游；改完回画布看组件是否自动变色。

## 5. 用组件

- 从 SDS `Components` 复制 Button、Input、Select、Checkbox、Tag、Table、Dialog、Card 到 `02_Components`。
- 用 SDS 的 variant/properties，不要 detach 后写死颜色。
- 缺的组件（账单分摊编辑器、审核差异视图）按 SDS 风格自建：8px 圆角、1px 边框、无阴影。
- 正文 16px；标签 14/12；触控 ≥44px。
- 状态不能只靠颜色：加文字/图标。

## 6. 导出

- 移动端 2x：`780×1688`。
- 管理端 1.5x：`2160×1350`。
- 导出前隐藏 `REF/`、`C/` 辅助层。
- 文件名按 `实验2_241220051_沈思涵/UI界面/界面XX_*.png`，不要带 `@2x`。

---

# 第二部分：变量 JSON

## 7. 文件选择

| 文件 | 用途 |
| --- | --- |
| `tokens/react-sds/react-sds.tokens-studio.json` | Tokens Studio 导入，再导出 Figma Variables / Styles |
| `tokens/react-sds/react-sds.dtcg.json` | DTCG 插件；Figma 原生导入上线后优先试 |
| `tokens/react-sds/sds-theme.css` | React CSS Variables |
| `tokens/react-sds/tailwind.config.js` | Tailwind 3 |
| `tokens/react-sds/tailwind-theme.css` | Tailwind 4 `@theme` |
| `SDS变量改色.csv` | 直接改 SDS 官方副本里的变量，不是导入文件 |

## 8. Tokens Studio 导入步骤

1. 打开 Figma Design 文件。
2. Plugins → **Tokens Studio for Figma**。
3. Settings → Token Format → **Legacy**。
4. Import / Load from file → `react-sds.tokens-studio.json`。
5. 左侧出现 `global` set。
6. Export to Figma：
   - Variables：颜色、尺寸、数字；
   - Styles：Typography、Shadow；
   - 新建 collection：`App Tokens`。
7. 检查：
   - `color/semantic/brand` → `color/brand/600`；
   - `text/body` 是 16px；
   - `state/pending` → `status/pending`。

> 不要把 App Tokens 直接覆盖 SDS 的 collection；SDS 组件用 SDS 变量，App Tokens 用于你自己的页面/组件。

## 9. DTCG 导入

- 用 **Variables Import/Export** 或 **Figma Variables JSON Import** 插件。
- 选 `react-sds.dtcg.json`。
- 不同插件对 color/typography/shadow 的支持不同；失败就回 Tokens Studio。

## 10. 原生导入说明

截至 **2026-10-26**，Figma 官方 Variables 文档只提供 Variables/Collections/Modes 的创建与应用，没有通用的“JSON 直接导入”入口。  
所以本指南不声称“拖进 Figma 就行”；当前用插件，DTCG 文件为将来原生导入预留。

---

# 第三部分：React 工程

## 11. 初始化

要求 Node 22 LTS（或 Vite 当前要求的最低版本）。

```bash
pnpm create vite@latest shared-ledger-web --template react-ts
cd shared-ledger-web
pnpm install
```

## 12. 依赖

```bash
# 运行时
pnpm add react-router @tanstack/react-query zustand \
  react-hook-form zod @hookform/resolvers \
  @tanstack/react-table echarts \
  openapi-fetch lucide-react date-fns \
  clsx tailwind-merge class-variance-authority \
  @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-dropdown-menu \
  @radix-ui/react-tabs @radix-ui/react-checkbox @radix-ui/react-radio-group \
  @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-popover

# 开发
pnpm add -D tailwindcss @tailwindcss/vite openapi-typescript \
  vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  msw @playwright/test eslint prettier
```

> 不安装 Vue、Element Plus、Vant、Art Design Pro。  
> SDS 不是 npm 组件包；不要找 `npm i @figma/sds`，用 Radix + Tailwind 实现。

## 13. Tailwind 4

`vite.config.ts`：

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
```

`tsconfig.app.json` 加：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

`src/styles/index.css`：

```css
@import "tailwindcss";
@import "./sds-theme.css";
@import "./tailwind-theme.css";
```

把 `tokens/react-sds/sds-theme.css` 和 `tailwind-theme.css` 复制到 `src/styles/`。

## 14. 目录

```text
src/
├─ app/router.tsx
├─ app/providers.tsx
├─ layouts/MobileShell.tsx
├─ layouts/AdminShell.tsx
├─ routes/mobile/
├─ routes/admin/
├─ features/
├─ components/ui/
├─ components/domain/
├─ api/schema.d.ts
├─ api/client.ts
├─ api/queries/
├─ stores/
├─ styles/
└─ lib/
```

## 15. Button 示例

```tsx
import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const button = cva(
  'inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-label font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'border-semantic-brand bg-semantic-brand text-white hover:bg-semantic-brand-hover',
        secondary: 'border-semantic-border bg-white text-semantic-text-primary hover:bg-semantic-bg-subtle',
        ghost: 'border-transparent bg-transparent text-semantic-text-primary hover:bg-semantic-bg-subtle',
        danger: 'border-semantic-state-danger bg-semantic-state-danger text-white',
      },
      size: { sm: 'h-8 px-3 text-caption', md: 'h-10 px-4 text-label', lg: 'h-11 px-5 text-body' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
```

> Tailwind class 名以实际配置为准；如果 `bg-semantic-brand` 没有生成，检查 `tailwind.config.js` 的 `semantic` key 和 `@theme`。

## 16. 路由与壳

```tsx
import { createBrowserRouter, Navigate } from 'react-router';
import { MobileShell } from '@/layouts/MobileShell';
import { AdminShell } from '@/layouts/AdminShell';

export const router = createBrowserRouter([
  { path: '/login', lazy: () => import('@/routes/login') },
  {
    path: '/app',
    element: <MobileShell />,
    children: [
      { index: true, element: <Navigate to="ledgers" replace /> },
      { path: 'ledgers', lazy: () => import('@/routes/mobile/ledgers') },
      { path: 'ledgers/:ledgerId', lazy: () => import('@/routes/mobile/ledger-home') },
    ],
  },
  {
    path: '/admin',
    element: <AdminShell />,
    children: [
      { path: 'ledgers/:ledgerId/reviews', lazy: () => import('@/routes/admin/reviews') },
    ],
  },
]);
```

- 未登录 → `/login?next=...`。
- 无权限 → 403 页面；不要泄漏账本是否存在。
- 一个页面只做一个壳；另一个宽度只做响应式检查。

## 17. API 与 Query

```bash
pnpm dlx openapi-typescript http://localhost:8000/openapi.json -o src/api/schema.d.ts
```

```ts
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const api = createClient<paths>({ baseUrl: '/api', credentials: 'include' });
```

- `queryKey` 包含 `ledgerId`、筛选、分页。
- 审核/还款后失效 `reviews`、`ledger`、`transactions`、`settlement`。
- 幂等键由前端生成，重试复用同一个 key。
- 金额用整数分；展示用 `Intl.NumberFormat`。

## 18. 表单

- React Hook Form + Zod；字段错误落到 `Field` 组件。
- 分摊/比例用 `useFieldArray`；提交前校验合计 = 金额。
- 日期用 `date-fns` 格式化；不要手写时区逻辑。
- 错误提示必须有文字，不能只有红框。

## 19. 表格

- TanStack Table：列定义、排序、分页、行选择。
- 审核表格：状态列、提交人、金额、操作；自录行禁用“审核”并显示“自审禁用”。
- 移动端不放大表格；改成 CardList。

## 20. 测试

- Vitest + React Testing Library：Button、Field、StatusTag、MoneyText、权限守卫。
- MSW：登录失败、409 幂等冲突、403 审核越权、空列表。
- Playwright：登录 → 记一笔 → 审核 → 结算 的关键路径。
- 至少跑 `pnpm build`、`pnpm test`、`pnpm exec playwright test`。

---

# 第四部分：落地检查

## 21. 需要同步的内容

- [x] `方案草稿.md`：技术栈直接更新为 React + SDS，无独立迁移文档。
- [x] UML 组件图：Vue/Vant/Element Plus → React/SDS。
- [x] UML 时序图参与者：Vant/Element Plus → React/SDS。
- [ ] `archive/refs/` 17 张旧图：只保留信息架构参考，正式 UI 用 SDS + 青绿重画。
- [ ] 实验报告：技术栈、组件图、UI 说明同步。

## 22. 验收

- [ ] Figma：SDS 副本，改的是 Variables，不是逐个 Fill。
- [ ] 青色只出现在 primary/链接/进度/选中态/重点数字。
- [ ] 8px 圆角、1px 边框、Inter、无卡片阴影。
- [ ] 360/390 无横向滚动；正文 16px；触控 ≥44px。
- [ ] React：`pnpm build` 通过；无 Vue/Element Plus/Vant 依赖。
- [ ] 变量 JSON 能通过 Tokens Studio 导入；不覆盖 SDS collection。
- [ ] 报告、UML、UI 文件三处技术栈一致。
