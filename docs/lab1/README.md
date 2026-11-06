# 实验一：需求分析

需求基线为仓库根目录的[requirements.md](../../requirements.md)，访谈与审核记录为[chat.txt](../../chat.txt)。两个文件保持原路径和内容，实验一标签保留。

| 目录 | 内容 |
| --- | --- |
| [interview/](interview/) | 甲方问卷、确认单及答复原文，保留原文件名 |
| [process/](process/) | 需求初稿、访谈整理前存档和一次性整理/审查脚本 |
| [report/报告编制/按模板/](report/报告编制/按模板/) | 已采用报告的LaTeX源文件及正文 |
| [report/报告编制/](report/报告编制/) | 早期报告源文件及本机编译/校对材料 |
| [archive/scratch/](archive/scratch/) | 早期临时文字副本 |

课程模板在[templates/lab1/](../templates/lab1/)，本机报告PDF和ZIP在`submissions/lab1/`。

重新编译：

```bash
cd docs/lab1/report/报告编制/按模板
xelatex report.tex
```

`process/`内两个Python脚本保存原始运行路径，仅作为历史过程资料；不要直接重跑覆盖当前需求与访谈文件。LaTeX中间文件和校对PNG保留本机并被Git忽略。
