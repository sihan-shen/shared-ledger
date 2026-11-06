# 实验二报告草稿

- 正文：`实验二报告草稿.md`，以实验一需求列表 V0.3 为基线。
- PDF 预览：`output/pdf/实验二_软件设计与建模_草稿.pdf`，生成脚本 `build_report.py`。
- AI 使用证据：`AI辅助记录.md`；本人工作补录入口：`人工修订记录模板.md`。
- `assets/uml/`：原 `../uml/` 的 9 份 PlantUML 源文件快照及在本轮重新渲染的 PNG。
- `assets/ui/`：同一版本本地React/shadcn原型导出的20张PNG，覆盖17个功能页面、首次改密状态、组件规范与页面目录。
- `assets/evidence/`：方案、两份设计审查、原型说明与核验、Figma断点等证据快照，并保存统一界面补充源码与本轮截图导出记录；来源映射见 `素材来源.json`。

正文采用实验报告体例，直接呈现系统设计与实验过程；编制记录、素材来源和审核意见单独保存在本目录中。

PDF正文精简为功能、架构、4种关键UML、模块UI说明、3页界面总览、AI过程与本人思考。图种包含类图、组件图、活动图、时序图，覆盖课程三类要求。17个功能页面均有缩略图，完整20张UI PNG与9组UML PNG/PUML保持在assets目录，供单独打包。

报告版式采用黑灰配色，界面与UML原图保留原色；不设参考资料节。正文使用A4；密集UML采用较大技术图页，3页UI总览使用A4横向。UI总览的手机图展示首屏，完整长图不在正文重复展开。

构建 PDF：

```bash
python3 build_report.py
```

需要 reportlab、Pillow，以及支持中文的 TrueType 字体；可通过 `REPORT_FONT_REGULAR` / `REPORT_FONT_BOLD` 指定字体。当前优先使用本机 Maple Mono 中文字体，脚本同时支持 Codex 自带 Python 运行时。

本轮在独立分支 `codex/lab2-report-draft` 记录一次 AI 辅助初稿。实验一标签与 master 保留。以后由本人阅读正文、核对图源和 UI 后，实际修改正文及 `人工修订记录模板.md`，再进行明确标记为人工修改的提交。不要只修改提交说明而没有实质内容差异。

## 提交包

已生成`submissions/lab2/实验2_241220051_沈思涵.zip`（8,407,418字节），压缩前目录为`submissions/lab2/实验2_241220051_沈思涵/`。包内仅包含`实验报告.pdf`、`UML/`、`UI界面/`，共39个文件：15页报告、9组UML PNG/PUML、20张当前UI PNG。

完整图片按报告页面编号命名，另含首次改密状态、组件规范和功能界面目录；未混入旧参考图、开发依赖或过程记录。逐文件来源与目标名见`打包清单.json`。生成脚本为`package_submission.py`，若目标已存在会停止，避免覆盖已有包。

已解压并直接比较文件字节，检查PDF可读和PNG解码；未执行哈希检查。ZIP与解压目录不进入Git，未上传课程系统。

## 截图导出

`export_ui.cjs`以脚本所在目录作为素材根目录，使用Playwright。可通过`PLAYWRIGHT_MODULE`指定模块路径、`CHROME_PATH`指定已有Chromium/Chrome、`UI_BASE_URL`指定已启动的本地原型地址；不设浏览器路径时使用Playwright默认浏览器。导出会更新assets/ui，正式打包前核对新截图与报告。
