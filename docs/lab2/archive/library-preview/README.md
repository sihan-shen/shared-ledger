# 设计库切换预览：Material 3 / Simple Design System

> v0.10：实现栈已切换 React + SDS；本目录只保留视觉比较，截图为 HTML/CSS 近似，不是最终 Figma 导出。

这些 PNG 是用 HTML/CSS 做的**视觉近似预览**，不是官方 Figma Kit 的组件实例。目的是比较“如果换设计语言，页面会变成什么样”，不是最终交付稿。

| 文件 | 内容 |
| --- | --- |
| `material3-mobile.png` | Material 3 默认基线紫：账本首页 |
| `sds-mobile.png` | Figma Simple Design System 风格：账本首页 |
| `material3-admin.png` | Material 3：待审核工作台 |
| `sds-admin.png` | Simple Design System：待审核工作台 |
| `sds-teal-mobile.png` | SDS 结构 + 青绿品牌色：账本首页（推荐方向） |
| `sds-teal-admin.png` | SDS 结构 + 青绿品牌色：待审核工作台（推荐方向） |

## 预览口径

### Material 3

- 默认基线紫 `#6750A4`（不是项目青绿；实际可用 teal seed 做 dynamic color）。
- 大圆角 16/28、tonal surface、filled/tonal 按钮、navigation bar 的 pill active indicator。
- Roboto / 16px body / 14px label；无渐变、弱阴影。
- 注意：M3 的 primary 是紫色时，和“记账/金钱”的语义会有距离；如果采用，建议用 teal seed 重新生成 color roles。

### Simple Design System（Figma SDS）

- 参考 Figma 官方 SDS 的 monochrome tokens：黑/白/灰，Inter，1px 边框，8px 圆角，无阴影。
- 状态色只做小面积 soft background（绿/黄/红）。
- 更像“专业工具/后台”，不如 M3 有消费级 App 的亲和力。
- 注意：SDS 官方是 React + Code Connect 示例；Vue 项目要自己实现组件，不能直接复用代码。

## 对比

| 维度 | 当前 A-lite（青绿） | Material 3 | Simple Design System |
| --- | --- | --- | --- |
| 视觉性格 | 清爽、金融感、双端密度 | 表达性强、圆润、移动优先 | 克制、专业、数据密集 |
| 与记账场景 | 很贴 | 偏“生活类 App”，紫色需换 seed | 偏工具/后台，移动端略冷 |
| 与 Element Plus/Vant | 已对齐 | 组件语言不一致，需要重做 | 组件语言不一致，需要重做 |
| 代码落地 | 现有栈可直接实现 | Vue 需 Material Web/自建，风险中高 | React 有官方示例；Vue 需自建，风险高 |
| Figma Kit | 自建 tokens/组件 | 官方 Material 3 Design Kit | Figma SDS Community + GitHub |
| 11 天课程项目 | 可保留 | 可作为视觉探索 | **SDS + 青绿：当前选定方向** |

## 结论

- 不建议在实验二截止前**整体切换**到 M3 或 SDS：会同时推翻 tokens、17 张 UI、组件库和 lab3 实现栈。
- 如果只是想让页面“更像成熟产品”：
  - 移动端优先看 **M3**，但用 teal seed 生成 color roles，而不是默认紫；
  - 管理端优先看 **SDS**，黑白灰 + 1px 边框很适合表格/审核。
- 折中方案：保留现有 A-lite 布局与业务组件，只把 **M3 的 shape/elevation** 或 **SDS 的边框/留白** 借一层进来；不要换组件库。

## 重新渲染

```bash
cd docs/lab2/archive/library-preview
./render.sh
```
