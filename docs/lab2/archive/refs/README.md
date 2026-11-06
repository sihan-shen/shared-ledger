# 实验二参考图（本地草稿）

这些图是用本地 HTML/CSS + headless Chrome 渲染的视觉参考，**不是最终 Figma/Pixso 交付**，也不替代 PlantUML 的 UML 图。
正式实验二仍需按课程要求用 UI 设计工具重绘并导出 PNG。

主色已定为青绿色 `#0f766e`，辅助色 `#14b8a6`，深色 `#115e59`。正文 tokens 为 16px；移动审核页是 16px 样张。

## 移动端（390×844 @2x）

| 文件 | 内容 |
| --- | --- |
| `mobile-login.png` | 登录 / 首登改密：账号密码、统一错误、失败 5 次暂停 15 分钟 |
| `mobile-ledgers.png` | 我的账本：使用中/已归档、角色、净余额、新建账本 |
| `mobile-home.png` | 账本首页：净余额、预算、待办、最近账目、TabBar |
| `mobile-entry.png` | 记一笔-支出：金额、日期、分类、付款人、参与人、分摊明细、提交 |
| `mobile-income.png` | 记一笔-收入：收款人、受益成员、平均分配、提交 |
| `mobile-transactions.png` | 账目列表与筛选：汇总、状态、日期分组、TabBar |
| `mobile-settlement.png` | 结算：成员余额、建议还款、待确认、结清条件 |
| `mobile-review.png` | 移动端待审核：金额、分摊、独立性、审核意见、通过/驳回；正文 16px |
| `mobile-review-360.png` | 同一页面的 360 宽检查：单列、无横向滚动 |
| `mobile-review-768.png` | 同一页面的 768 宽检查：居中 680px 内容区 |

## 管理端（1440×900 @1.5x）

| 文件 | 内容 |
| --- | --- |
| `admin-review.png` | 待审核：队列 + 详情、独立性校验、自审禁用、审核意见 |
| `admin-members.png` | 成员与角色 + 邀请抽屉：角色、状态、净余额、邀请链接 |
| `admin-correction.png` | 更正 / 作废申请：待处理队列、原值/新值 diff、版本与影响 |
| `admin-budget.png` | 预算与统计：月度预算、分类支出、近 6 月、成员统计 |
| `admin-logs.png` | 操作日志：操作者、动作、对象、变更、原因、trace |
| `admin-settings.png` | 账本设置 / 归档：检查清单、分类管理、归档与留存 |
| `admin-maintainer.png` | 账号维护：开通、重置、领用渠道、首次登录、维护账号隔离 |

## 架构

| 文件 | 内容 |
| --- | --- |
| `architecture.png` | 浏览器双壳 → Nginx → FastAPI → PostgreSQL → 备份 |

## 重新渲染

```bash
cd docs/lab2/refs
./render.sh
```

需要 `/opt/google/chrome/chrome` 和 `dot`（Graphviz）。如果 Chrome 路径不同，设置 `CHROME=/path/to/chrome ./render.sh`。

## 说明

- 图中的金额、成员、账目均为示例数据，不是真实业务数据。
- 修改品牌色时，改各 HTML 里 `:root` 的 `--brand*` 变量和 `mobile-screens.css`/`admin-screens.css` 即可。
- `architecture.png` 是 Graphviz 画的实现分层参考，不是最终 UML 部署图；正式报告用 PlantUML 重画。
- 05 邀请加入已并入 `admin-members.png` 右侧抽屉；09 账目详情由 `mobile-review.png` / `admin-review.png` 的详情覆盖；其余模块均有代表界面。
- `mobile-review-360.png` / `-768.png` 用于 REQ-035 的 360/768 宽度检查；参考图中标签/辅助信息为 12–14px；录入表单值与移动审核页正文按 16px。管理端紧凑表格的 11–13px 仍须在正式 Figma 中按 16px 正文重绘。
