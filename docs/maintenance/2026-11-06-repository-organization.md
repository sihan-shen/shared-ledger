# 仓库整理记录 · 2026-11-06

目标：建立清楚的实验入口，正常跟踪源码和设计资料，集中成品并排除缓存，保留实验一标签及所有独有文件。

## 目录调整

| 原位置 | 新位置 |
| --- | --- |
| docs/interview、docs/process、docs/report | docs/lab1下的同名目录 |
| docs/scratch | docs/lab1/archive/scratch |
| docs/template | docs/templates/lab1 |
| docs/lab2/refs、library-preview、figma-draft、submit | docs/lab2/archive下的同名目录 |
| docs/lab2/.tools/plantuml | .cache/plantuml（本地工具缓存） |
| 根目录report.pdf、实验一ZIP | submissions/lab1 |
| 根目录实验二ZIP及解压目录 | submissions/lab2 |
| .stage中的相同实验二副本 | 与submissions/lab2解压目录逐项比较后合并 |

根目录requirements.md、chat.txt保持路径与内容，实验一两个标签未改动。实验二报告PDF、图片、UML图源及ZIP内容不变。历史过程脚本保留原文和原运行路径，入口README注明为一次性档案。

## 版本与工具

- 去掉对整个docs的忽略，正常纳入UI源码、tokens、设计资料、访谈、模板和过程记录。
- 依赖、dist、工具缓存、报告临时渲染、LaTeX产物、提交ZIP与解压副本继续忽略。
- 打包脚本改用submissions/lab2；清单只更新外层位置。
- UML渲染默认工具路径改为.cache/plantuml；截图导出使用脚本目录及可配置运行时，去掉机器绝对路径。
- 增加根目录及各实验README，HANDOFF压缩为当前有效状态。
- .gitattributes保留Markdown硬换行及原始访谈存档空白，不为整理目录改写原文。

## 核验

- `npm run build`通过（TypeScript与Vite生产构建）。
- 3个活动Python脚本AST解析通过，截图脚本`node --check`通过，3个渲染shell脚本`bash -n`通过，JSON配置可解析。
- 新PlantUML缓存中的Java可运行；打包脚本导出的workspace、成品和清单路径均存在。
- 根目录/实验/成品入口README的相对链接均可解析。
- 实验二ZIP的39项与解压目录、当前素材逐项直接比较一致；实验一ZIP内的需求与访谈等于根基线。根需求和访谈与HEAD内容相同，两个实验一标签保留。
- 新增可跟踪文件中未发现node_modules、dist、工具缓存或报告tmp；成品、依赖、工具及临时渲染均被忽略规则排除。
- 未改写报告PDF、UI图片或UML图源；没有运行浏览器流程、重新渲染UML/PDF或推送远程。
- 按用户要求不新增或运行软件测试，不执行哈希检查。
