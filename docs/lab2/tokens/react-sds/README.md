# React + SDS tokens

这套 tokens 是 **React 19 + Simple Design System 风格 + 青绿品牌色** 的源数据。

| 文件 | 用途 |
| --- | --- |
| `react-sds.tokens-studio.json` | 导入 Tokens Studio，再导出为 Figma Variables / Text Styles |
| `react-sds.dtcg.json` | W3C DTCG；给支持 DTCG 的插件，或 Figma 原生导入上线后使用 |
| `sds-theme.css` | React 项目 CSS Variables |
| `tailwind.config.js` | Tailwind 3 兼容配置 |
| `tailwind-theme.css` | Tailwind 4 `@theme` |
| `generate.py` | 从一套源数据重新生成 |

## 先说明：Figma 原生导入

截至 **2026-10-26**，Figma 官方 Variables 文档没有提供“把 JSON 直接拖进 Variables 面板”的通用入口；官方入口是 Variables / Collections / Modes 的创建与应用，跨工具导入主要靠插件。

所以：

- **Figma 导入**：用 Tokens Studio（legacy JSON）或支持 DTCG 的插件。
- **不要**把 `react-sds.tokens-studio.json` 直接拖到 Figma 原生 Variables 面板。
- 如果将来 Figma 出现原生导入，优先试 `react-sds.dtcg.json`。

## 导入 Figma 的推荐方式

### 方式 A：Tokens Studio（当前最稳）

1. 打开你的 Figma 设计文件。
2. 运行 **Tokens Studio for Figma**。
3. Settings → Token Format → **Legacy**。
4. Import / Load from file → 选 `react-sds.tokens-studio.json`。
5. 左侧出现 `global` set。
6. Export to Figma：
   - Variables：颜色、尺寸、数字；
   - Styles：Typography → Text Styles，Shadow → Effect Styles；
   - 新建 collection，命名 `App Tokens`。
7. 检查：
   - `color/semantic/brand` 是否指向 `color/brand/600`；
   - `text/body` 是否 16px；
   - `state/pending` 是否指向 `status/pending`。

### 方式 B：DTCG 插件

用 **Variables Import/Export** 或 **Figma Variables JSON Import** 类插件导入 `react-sds.dtcg.json`。不同插件对 color/typography/shadow 支持不一致；失败就用 Tokens Studio。

## 重要：不要把这个文件直接导进 SDS 的变量集合

SDS 官方 Kit 有自己的 `sds-color-*` / `color/brand/*` 变量。`react-sds.*.json` 是 **App Tokens**，不是 SDS 变量覆盖包。

- 如果你在设计文件里用 SDS 组件：按 `docs/lab2/SDS变量改色.csv` 改 SDS 自己的 `brand` primitive / semantic 变量。
- 如果你要一套新的 App Tokens：把 `react-sds.*.json` 导入 **新 collection** `App Tokens`，不要把 SDS collection 覆盖掉。
- 两套同时存在时，组件绑定哪套要统一；不要一半 SDS 变量、一半 App Tokens。

## React 使用

```ts
import './styles/sds-theme.css';
```

```tsx
<button className="h-10 rounded-md bg-semantic-brand px-4 text-body font-medium text-white">
  记一笔
</button>
```

Tailwind 3：

```js
const tokens = require('./tokens/react-sds/tailwind.config.js');
module.exports = { theme: { extend: tokens.theme.extend } };
```

Tailwind 4：把 `tailwind-theme.css` 的 `@theme` 合并到主 CSS。

## 命名

- 颜色：`--sds-color-brand-*`、`--sds-color-neutral-*`、`--sds-color-status-*`、`--sds-color-state-*`。
- 排版：`--sds-text-body-size` / `--sds-text-body-line`。
- 圆角：`--sds-radius-md`（8px）。
- 边框：`--sds-border-width`（1px）。
- 阴影：`--sds-shadow-focus`；SDS 默认无卡片阴影。

`state-*` 是语义状态（pending/success/danger/info），`status-*` 是原始状态色；不要混用。

## 重新生成

```bash
python3 docs/lab2/tokens/react-sds/generate.py
```
