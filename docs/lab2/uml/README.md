# 实验二 UML 设计

9 张 PlantUML 图，源文件与 PNG 同名。类别覆盖：结构性（类图/组件图/部署图）、行为性（用例图/状态图/活动图）、交互性（时序图）。

| 文件 | 类别 | 说明 |
| --- | --- | --- |
| `UML类图` | 结构（必画） | 领域类、关系、多重性、版本模型 |
| `UML组件图` | 结构 | 双壳 Web、Nginx、FastAPI 模块、Repository、DB、备份 |
| `UML部署图` | 结构 | 浏览器、应用服务器、PostgreSQL、备份介质 |
| `UML用例图` | 行为 | 6 参与者（含已登录账号）、按权限拆分的用例、2 个 include |
| `UML状态图_收支版本` | 行为 | 收支版本七状态（含 SUPERSEDED） |
| `UML状态图_更正申请` | 行为 | 更正/作废四状态 |
| `UML状态图_还款纠错` | 行为 | 原付款人申请、原收款人处理；0 额不新建 |
| `UML活动图_审核流程` | 行为 | 成员/前端/服务端/审核员泳道 |
| `UML时序图_审核通过` | 交互 | 幂等、行锁、事务、审计 |

## 渲染

```bash
cd docs/lab2/uml
./render.sh
```

默认使用 `.cache/plantuml` 下的本地 JRE + PlantUML。若本机已有 Java/PlantUML：

```bash
JAVA=java PLANTUML_JAR=/path/to/plantuml.jar ./render.sh
```

字体使用 `Noto Sans CJK SC`；如换机器后中文变方框，先确认该字体存在。

报告与打包使用`../report-draft/assets/uml/`中的快照，编辑本目录后需同步快照并重新生成报告。
