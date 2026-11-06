# 多人共享记账系统 · 软件工程实验

本仓库保存需求分析、软件设计与建模、UI原型及实验报告的可编辑材料。

| 入口 | 内容 |
| --- | --- |
| [requirements.md](requirements.md) | 实验一需求基线，REQ-001～041 |
| [chat.txt](chat.txt) | 需求访谈、AI辅助与审核记录 |
| [实验一资料](docs/lab1/README.md) | 访谈、需求整理过程与LaTeX报告源文件 |
| [实验二资料](docs/lab2/README.md) | 架构、PlantUML、SDS tokens、本地UI原型与报告 |
| [提交成品](submissions/README.md) | 两次实验的本地报告、ZIP及解压目录位置 |
| [HANDOFF.md](HANDOFF.md) | 当前进展、关键约束和继续工作入口 |

## 本地UI原型

```bash
cd docs/lab2/ui-prototype
npm ci
npm run dev
```

按终端地址访问，`#/design`展示17个功能页面，`#/components`展示可复用组件。技术栈为React、TypeScript、Vite、shadcn/ui及本地SDS tokens。原型采用内存示例数据。

## 实验二报告与打包

```bash
python3 docs/lab2/report-draft/build_report.py
python3 docs/lab2/report-draft/package_submission.py
```

报告生成需要reportlab、Pillow及中文字体，打包另需pypdf。ZIP输出到`submissions/lab2/`；若同名成品或解压目录已存在，脚本停止，避免覆盖。

## 目录约定

- 当前设计及源码放在`docs/lab2/`；早期HTML、Figma与视觉比较材料放在`docs/lab2/archive/`。
- 访谈、课程模板和过程资料纳入版本控制；依赖、工具缓存、编译日志及临时渲染图由`.gitignore`排除。
- 报告引用的图片与已审阅PDF保存在`report-draft/`，提交ZIP及其解压副本统一放在`submissions/`，留在本机。
- 实验一的`lab1-ai-draft`、`lab1-final`标签保留原历史；根目录需求文件和访谈记录继续作为基线。
