# 本地 shadcn/ui 组件化实施计划

**目标：** 按用户已选的 shadcn/ui + SDS 青绿方向，建立可本地运行、复用现有 tokens 的 React UI 原型。

**依据：** `docs/lab2/方案草稿.md` 第 6–8、15.4、18.7 节；2026-10-29 用户确认采用 shadcn/ui、保持 SDS + 青绿并注重组件复用。

**架构：** `tokens/react-sds/sds-theme.css` 为共享视觉源；新增 `ui-prototype/src/styles/theme.css` 将 shadcn 语义变量映射到 SDS。官方 shadcn 源码放在 `components/ui`，业务组件放在 `components/domain`，壳层与页面分别位于 `layouts`、`pages`。状态与示例数据集中管理，金额使用整数分。

**技术：** React 19、TypeScript、Vite、Tailwind CSS 4、shadcn/ui（Radix）、Lucide。仅本地运行；不发布、不提交 Git，不触及旧 HTML/SVG/截图。

## 约束

- 保留主色 #0F766E、8px 圆角、1px 边框、正文 16px、无卡片阴影、触控目标至少 44px。
- 直接导入既有 SDS CSS，不复制另一套品牌色值；基础组件不含业务规则。
- 示例成员统一使用成员A/B/C/D；原型仅使用浏览器内存，不连接真实账户或后端。
- 按用户要求不编写测试、不执行哈希检查；以类型检查、生产构建、浏览器人工交互与视觉检查验证。
- 原型首轮覆盖原有五屏：首页、支出录入、独立审核、结算还款、审核工作台，并附组件展示页；其余页面保持原规划。

## 步骤

- [x] 建立 `docs/lab2/ui-prototype` 工程，接入官方 shadcn 基础组件，记录来源。
- [x] 建立 SDS → shadcn 变量映射及全局排版、焦点、触控规范。
- [x] 实现 MoneyText、StatusBadge、MemberAvatar、AllocationList、MetricCard、EmptyState 等业务组件与双壳层。
- [x] 用共享组件组合五屏及组件展示页，提供本地录入、筛选、审核反馈和确认弹窗。
- [x] 类型检查与生产构建；在 360/390/768/1440 宽度查看代表页面，人工操作关键控件。
- [x] 同步方案、操作指南、README、HANDOFF，说明已完成范围和未验证范围。

## 核验关注点

窄屏内容溢出、Dialog 键盘与焦点、本人账目不能自审、待审金额不计正式预算/余额、元/分展示、表单错误文字、切换页面后的共享状态。
