# 共享账本 · 本地 UI 原型

当前采用 **React + shadcn/ui + SDS 青绿**。设计、组件预览与交互均在本机运行，不依赖 Figma Web。

## 启动

```bash
cd docs/lab2/ui-prototype
npm ci
npm run dev
```

按终端显示地址访问，默认 `http://127.0.0.1:5173/`。首次需要联网安装依赖；安装后页面不加载远程字体、脚本或 API。运行需要 Node.js 20.19+ 或 22.12+（参照 Vite 的 engines）；本轮使用 Node.js 26.12.1、npm 12.2.1。依赖由 `package-lock.json` 锁定；本原型使用 npm，避免在同目录混用锁文件。

```bash
npm run typecheck
npm run build
npm run preview
```

## 已有页面

| URL hash | 页面 | 交互 |
| --- | --- | --- |
| `#/` | 账本首页 | 余额、预算、待办、账目状态筛选 |
| `#/entry` | 支出录入 | 金额/说明/成员校验、平均分摊、提交待审核 |
| `#/review` | 独立审核 | 选择账目、禁止自审、驳回意见、通过确认 |
| `#/settlement` | 结算还款 | 成员净余额、待确认占用、收款确认 |
| `#/admin` | 审核工作台 | 搜索、资格筛选、桌面表格/手机卡片、共享审核详情 |
| `#/components` | 组件与规范 | 基础组件、业务组件、颜色与排版；可直接操作 |

`#/design` 为17个功能页面的统一目录。补充页面在 `#/design/:screen`，包括login、ledgers、members、invite、income、transactions、detail、correction、budget、logs、settings、maintainer；复用同一主题、基础件和业务组件。登录按钮可切换首次改密状态。补充页面用于设计展示，提示性操作不调用后端。

## 组件分层

```text
src/
├── components/
│   ├── ui/          # 官方 shadcn 基础件，不读取账本状态
│   └── domain/      # MoneyText、StatusBadge、MemberAvatar、AllocationList、
│                    # MetricCard、TransactionRow、EmptyState、ConfirmAction、ReviewDetail
├── layouts/         # AppShell、MobileShell、AdminShell
├── pages/           # 组合组件，不复制 UI 基础件；非首页按路由懒加载
├── styles/theme.css # SDS → shadcn 语义变量适配 + 全局交互规范
├── state/ledger.tsx # 演示共享状态与操作
├── data/demo.ts     # 匿名成员、类型与示例数据
└── lib/             # cn、整数分格式化、金额解析与均摊
```

**主题来源唯一：** `src/styles/theme.css` 直接导入 `../tokens/react-sds/sds-theme.css`（相对于本工程根目录的共享文件）。不复制品牌色，不修改共享 tokens。`--primary`、`--accent`、`--border` 等别名映射到 SDS；现有 `tailwind-theme.css` 含静态色值，本原型不重复导入它。

- 青绿主色 `#0F766E`，8px 圆角、1px 边框、无卡片阴影。
- 正文和输入为 16px；辅助信息 12/14px；按钮和选择项至少 44px。
- 状态有图标与文字；较亮的状态色用于图标和浅底，状态文字使用深色 token。
- 移动端单列；管理端宽屏队列 + 详情，手机切为卡片；弹窗限制可用高度并可滚动。
- 金额只用整数分；均摊尾差按成员顺序逐分分配；界面展示统一用 `MoneyText`。
- 页面状态通过 Context + reducer 共享；原型无需引入 API 缓存或额外全局状态库。
- 新页面直接复用 `components/ui` 和 `components/domain`；新增 shadcn 基础件后沿用本主题，不运行 init 覆盖主题。

## 官方组件来源

13 个基础组件取自 shadcn 官方 `new-york-v4` registry，来源清单见 `shadcn-sources.json`，许可见 `SHADCN-LICENSE.md`。配置在 `components.json`。

局部适配：`cn` 与组件导入路径改为本地别名；Dialog 关闭文字改为中文，遮罩引用 SDS token；主按钮悬停引用 SDS brand-hover。圆角、字号、触控和阴影通过主题统一约束。其余交互保留 Radix/shadcn 实现，不另造一套同名按钮或弹窗。

参考：[shadcn Vite](https://ui.shadcn.com/docs/installation/vite)、[主题说明](https://ui.shadcn.com/docs/theming)。

## 演示边界

只使用内存示例，刷新或顶部“重置演示数据”后恢复。示例预算包含未逐条列出的历史账目，首页仅显示代表记录。状态不保存到磁盘，也不会传给外部服务。

本地演示包含：待审不入正式预算/余额、本人不能审核自己的录入、驳回需原因、通过更新预算与分摊余额、余额变更后统一撤销失效的待确认还款、收款确认更新双方余额。上述操作用于展示 UI 状态，不替代服务端鉴权、事务、并发、幂等和持久化。

未接入 FastAPI、真实账户或真实付款。正式业务校验、真实设备 Safari/Android 和课程对设计工具的具体要求仍需后续落实。早期HTML、视觉比较、Figma草图及旧提交图片保存在 `../archive/`，当前报告图片使用 `../report-draft/assets/ui/`。

## 本轮验证

验证结果见 `VALIDATION.md`。按用户要求不新增测试文件，不执行哈希检查。
