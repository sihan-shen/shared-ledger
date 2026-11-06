# 当前交接

## 当前目标与进展

2026-11-06：按用户要求整理仓库并commit。已按实验归拢资料、集中提交成品、合并相同解压副本，更新脚本和文档入口。静态、构建、归档内容及暂存范围核对完成。本次提交主题：`chore: organize lab materials and track UI prototype`。

## 重要决定与文件

- 根requirements.md、chat.txt继续作为需求基线；lab1-ai-draft和lab1-final标签保留。
- docs/lab1保存访谈、整理过程与报告LaTeX；docs/templates/lab1保存课程模板。
- docs/lab2保留当前方案、uml、tokens、ui-prototype与report-draft；旧HTML、视觉对比、Figma草图和旧submit放archive。
- submissions/lab1和submissions/lab2集中本地成品；实验二ZIP名称与39个包内文件不变。唯一解压副本保存在submissions/lab2，原.stage重复副本已逐文件比较后合并。
- .gitignore正常跟踪源码和设计材料，忽略依赖、dist、.cache、临时渲染、LaTeX产物及提交成品。
- docs/lab2/report-draft/package_submission.py改用submissions/lab2；uml/render.sh工具路径改为.cache/plantuml；export_ui.cjs运行时可配置。
- 报告保持15页黑灰版、4种UML及3页17界面总览，不含参考资料、Git章节和具体模型名称；AI表为8类，报告修订子项归入报告整理。UI继续用SDS青绿。
- 本人确认的参与方式为先设计架构、讨论技术栈/UI风格、AI生成UML后人工审核；不将AI实现冒称手工修改。

## 核验与约束

- `npm run build`通过，Python/Node/shell语法与JSON配置通过；新的Java缓存路径可运行。
- 根目录及各实验README的导航链接、打包脚本路径均有效。
- 实验二ZIP内39项与解压目录和素材直接比较一致，实验一ZIP基线及根requirements/chat内容不变；两个实验一标签保留。
- 依赖、构建目录、工具、报告临时渲染和成品均被Git忽略。详细映射与核验见docs/maintenance/2026-11-06-repository-organization.md。

不新增/运行软件测试，不执行哈希检查。没有推送远程或上传课程系统。旧一次性过程脚本仅作档案，不直接重跑。

## 下一步

本轮完成后以commit记录为准。继续开发从根README及docs/lab2/README进入；更改报告/素材后保留旧成品再打包。
