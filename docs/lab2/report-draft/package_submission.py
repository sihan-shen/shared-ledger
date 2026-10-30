"""Package the reviewed Lab 2 PDF, PlantUML files and current UI screenshots."""
from __future__ import annotations

import json
from pathlib import Path
import re
import shutil
import tempfile
from zipfile import ZipFile, ZIP_DEFLATED

from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
WORKSPACE = ROOT.parents[2]
NAME = "实验2_241220051_沈思涵"
STAGE = WORKSPACE / ".stage" / NAME
OUTPUT = WORKSPACE / f"{NAME}.zip"
MANIFEST = ROOT / "打包清单.json"
UI_FILES = [
    ("login-current.png", "01_账号登录.png"),
    ("password-current.png", "01_首次登录改密.png"),
    ("ledgers-current.png", "02_账本列表.png"),
    ("home-current.png", "03_账本首页.png"),
    ("members-current.png", "04_成员与邀请.png"),
    ("invite-current.png", "05_邀请加入.png"),
    ("entry-current.png", "06_支出录入.png"),
    ("income-current.png", "07_收入录入.png"),
    ("transactions-current.png", "08_账目列表.png"),
    ("detail-current.png", "09_账目详情.png"),
    ("admin-current.png", "10_管理审核工作台.png"),
    ("review-current.png", "11_移动审核详情.png"),
    ("correction-current.png", "12_更正与作废.png"),
    ("budget-current.png", "13_预算与统计.png"),
    ("settlement-current.png", "14_结算与还款.png"),
    ("logs-current.png", "15_操作日志.png"),
    ("settings-current.png", "16_设置与归档.png"),
    ("maintainer-current.png", "17_账号维护.png"),
    ("components-current.png", "18_组件与规范.png"),
    ("screens-current.png", "19_功能界面目录.png"),
]


def package() -> None:
    if STAGE.exists() or OUTPUT.exists():
        raise FileExistsError("目标文件夹或ZIP已存在，请先保留旧版再重新打包。")
    report = ROOT / "output/pdf/实验二_软件设计与建模_草稿.pdf"
    files = [(report, Path("实验报告.pdf"))]
    sources = sorted((ROOT / "assets/uml").glob("*.puml"))
    if len(sources) != 9:
        raise ValueError("应包含9份PlantUML源文件。")
    for source in sources:
        files.extend([(source, Path("UML") / source.name),
                      (source.with_suffix(".png"), Path("UML") / source.with_suffix(".png").name)])
    files.extend((ROOT / "assets/ui" / src, Path("UI界面") / dst) for src, dst in UI_FILES)
    for source, target in files:
        if not source.is_file() or source.stat().st_size == 0:
            raise ValueError(f"源文件缺失或为空：{source}")
        if source.suffix == ".png":
            with Image.open(source) as image:
                image.load()
        elif source.suffix == ".puml":
            content = source.read_text()
            if "@startuml" not in content or "@enduml" not in content:
                raise ValueError(f"PlantUML图源标记缺失：{source}")
    pdf = PdfReader(report)
    text = "\n".join(page.extract_text() for page in pdf.pages)
    if len(pdf.pages) != 15 or "241220051" not in text or "沈思涵" not in text:
        raise ValueError("报告页数或身份信息与当前版本不一致。")
    if any(term in text for term in ("参考资料", "Git记录与成果组织", "gpt-6")):
        raise ValueError("报告含有已要求删除的内容。")
    markdown = (ROOT / "实验二报告草稿.md").read_text()
    referenced = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", markdown)
    source_paths = {source.resolve() for source, _ in files}
    if any((ROOT / target).resolve() not in source_paths for target in referenced):
        raise ValueError("报告引用的图片未全部纳入打包范围。")
    names = [str(Path(NAME) / target) for _, target in files]
    if len(set(names)) != len(files):
        raise ValueError("包内文件名重复。")
    STAGE.mkdir(parents=True)
    for source, target in files:
        destination = STAGE / target
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    with ZipFile(OUTPUT, "x", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for _, target in files:
            archive.write(STAGE / target, (Path(NAME) / target).as_posix())
    # Reopen and extract, comparing file bytes directly without hash checks.
    with tempfile.TemporaryDirectory(prefix="lab2-unpack-") as directory, ZipFile(OUTPUT) as archive:
        if set(archive.namelist()) != set(names):
            raise ValueError("ZIP文件目录与预期不一致。")
        archive.extractall(directory)
        for source, target in files:
            extracted = Path(directory) / NAME / target
            if extracted.read_bytes() != source.read_bytes():
                raise ValueError(f"解压文件与源文件不一致：{target}")
        if len(PdfReader(Path(directory) / NAME / "实验报告.pdf").pages) != 15:
            raise ValueError("解压后的PDF无法正常读取。")
    metadata = {
        "archive": str(OUTPUT.relative_to(WORKSPACE)),
        "folder": str(STAGE.relative_to(WORKSPACE)),
        "reportPages": len(pdf.pages),
        "fileCount": len(files),
        "umlPngCount": len(sources),
        "plantUmlCount": len(sources),
        "uiPngCount": len(UI_FILES),
        "zipBytes": OUTPUT.stat().st_size,
        "verification": "已解压并逐文件直接比较字节，PDF可读，所有PNG可解码；未执行哈希检查。",
        "files": [{"source": str(source.relative_to(ROOT)), "target": target.as_posix(),
                   "bytes": source.stat().st_size} for source, target in files],
    }
    MANIFEST.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: value for key, value in metadata.items() if key != "files"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    package()
