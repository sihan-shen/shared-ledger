# Lab2 Figma UI 首轮草图

日期：2026-10-26。状态：五屏可编辑草图，供评审布局与层次；不是全部 17 屏的最终交付。

2026-10-27 续接：当前优先完成五屏组件化。已建立分摊行主组件与文字属性，尚未集成至页面；全面组件化未完成。MCP 额度仍受限，本会话缺少原生浏览器编辑工具，未发生新的 Figma 写入。断点和节约调用的批次计划见 [componentization-plan.md](componentization-plan.md)，精确状态见 [componentization-state.json](componentization-state.json)。

## 设计文件

继续使用用户已有的 [SoftwareEngineeringUI](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI)。

| 页面 | 内容 | Figma 节点 |
| --- | --- | --- |
| 03_Mobile | 四屏核心流程总览，横向 Auto Layout，间距 96 | [16:6519](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-6519) |
| 03_Mobile | 03_账本首页_390×844 | [16:7044](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-7044) |
| 03_Mobile | 06_记一笔支出_390×844 | [16:7045](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-7045) |
| 03_Mobile | 11_独立审核详情_390×844 | [16:7046](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-7046) |
| 03_Mobile | 14_结算还款_390×844 | [16:7047](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-7047) |
| 04_Admin | 草图_v01_10_待审核工作台_1440，1440×900 | [16:6898](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-6898) |
| 04_Admin | 05_审核详情面板，416×576 | [16:7048](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-7048) |
| 04_Admin | 02_审核操作栏，376×48，横向 Auto Layout，间距 12 | [16:7053](https://www.figma.com/design/OawVRRlprBz939FE6iqxuE/SoftwareEngineeringUI?node-id=16-7053) |

连接器最初另建了 [Lab2 · 共享账本 · SDS UI 草图](https://www.figma.com/design/L20Dm1kb18D3mWQV2adien)，该文件为空，实际成果在上表的原文件中。

## 依据与层次

- 依据 `../方案草稿.md`、`../React_SDS_操作指南.md`、`../refs/` 和根目录 `requirements.md`。
- 沿用已有 SDS + 青绿方向：主色 #0F766E、8px 圆角、1px 边框、无卡片阴影；正文 16px，辅助信息 12/14px。
- 移动端：流程容器 → 独立页面 Frame → 页头、主要内容、业务分区、操作栏 → 可编辑文字与形状。
- 每个移动页面 Frame 内包含对应真实 SDS Button 实例；外层流程容器为横向 Auto Layout。页面内部业务草图仍为固定布局分组，尚未全部转为自动布局。
- 管理端：页面背景、全局导航、页头与定位、关键摘要、待审队列、审核详情面板。重试已完成详情层级整理：`05_审核详情面板` → `01_账目信息与审核依据`、`02_审核操作栏` → `操作_驳回`、`SDS_审核通过`。
- 详情面板保持原位置 (1000, 296) 和尺寸 416×576；操作栏相对位置 (20, 528)，376×48，横向 Auto Layout、12px 间距、零内边距。页面背景已命名 `00_页面背景`。
- 画布文字和基础图形可编辑，未以整页截图充当 UI 图层。

## SDS Assets 使用范围

- 从 Assets → Simple Design System → Button 插入真实组件实例，保留组件链接和属性；共用于首页记账、提交审核、审核通过、确认到账，以及管理端审核通过。
- 新建本地颜色变量 `App/Brand/Default = #0F766E`，用于这些实例的填充与边框。其余 SDS 组件变量继续来自库。
- 其余卡片、表单字段、标签、表格与导航先使用可编辑草图图层，尚未全部替换成 SDS 实例；整套页面也尚未全部绑定语义变量。
- 管理端已移除 `操作_审核通过` 重复占位，保留真实 `SDS_审核通过` 实例及 `App/Brand/Default` 填充、边框绑定。移动端关键按钮下的同位草图占位尚待后续细化时移除。

## 业务口径

- 支出 120 元由成员A、成员B、成员C三人均摊，各 40 元；待审核金额不计正式统计、预算和余额。
- 审核员不得审核本人录入的记录；参与付款或分摊本身不阻止独立审核。
- 管理端待审核 3 笔，其中本人录入 1 笔，可由当前用户审核 2 笔。
- 结算示意：成员净余额 +120、−80、−40、0，合计为零。待确认收款 50 元占用额度，当前可收 70 元，但确认前净余额仍为 120 元。
- 收款人确认到账；实际付款人完成线下转账后登记。未加入真实支付、导出或批量审核入口。
- 所有金额与人员组合均为草图示意数据。
- 已按用户要求将全文件设计文字、姓名简称和分摊分组名匿名化为成员A／B／C／D；在 Figma 全文件查找中逐项检查原姓氏，均显示无结果。两份 SVG 源稿及本地移动端、管理端截图已同步匿名化。

## 本地文件与核验

- `mobile-figma.jpg`：原 Figma 文件的实际浏览器截图；已查看，四屏顺序、分层与操作栏正常。
- `admin-figma.jpg`：管理端图层整理并匿名化后的实际浏览器截图；已保存并查看。图层树显示面板、内容与操作栏的父子关系，右侧可见画板尺寸。
- `mobile-draft.svg`、`admin-draft.svg`：导入 Figma 前的草图源文件，含可编辑文字与命名分组；不包含随后插入的真实 SDS 实例、Figma 自动布局和最终容器整理。继续编辑以 Figma 为准。
- 已在 Figma 实际画面检查移动四屏和管理端工作台；已通过属性面板核对 SDS 来源、品牌变量、移动主按钮 48px 高和画板尺寸。
- 管理端整理后核对了详情面板位置及尺寸、操作栏尺寸与 12px 间距，并确认主按钮仍链接 Simple Design System，标签与品牌变量正确。
- 未编写或运行测试，未执行哈希检查。未验证交互原型、真实业务行为、360/768 适配或全部 17 屏。

## 阻塞与下一步

1. Figma Starter 的 MCP 调用额度已用尽，无法继续通过连接器搜索与批量创建 SDS Assets；后续本轮使用浏览器编辑。
2. 前次浏览器切换管理端时的自动审批服务故障已在用户要求重试后恢复，本次管理端图层整理与截图已完成，无本轮阻塞。
3. 后续移除移动端关键按钮下的草图占位；将剩余基础件替换为 SDS 实例，补齐局部 Auto Layout 和语义变量。
4. 评审本轮风格与信息密度后，再扩展其余 12 屏、错误/空状态、交互及 360/768 适配；最终导出保持 Lab2 既定编号。
