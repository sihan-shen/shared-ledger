"""Render the editable Markdown draft to a self-contained Chinese PDF."""

from __future__ import annotations

import os
import math
from pathlib import Path
import re
from xml.sax.saxutils import escape

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, A3, A2, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, KeepTogether, NextPageTemplate,
    PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "实验二报告草稿.md"
OUTPUT = ROOT / "output/pdf/实验二_软件设计与建模_草稿.pdf"
TEAL = colors.HexColor("#0F766E")
PALE = colors.HexColor("#F0FDFA")
INK = colors.HexColor("#20252A")
MUTED = colors.HexColor("#5A626B")
LINE = colors.HexColor("#DCE5E3")
FONT = os.environ.get("REPORT_FONT_REGULAR", "/usr/share/fonts/maple/MapleMonoNL-NF-CN-Regular.ttf")
BOLD = os.environ.get("REPORT_FONT_BOLD", "/usr/share/fonts/maple/MapleMonoNL-NF-CN-SemiBold.ttf")
pdfmetrics.registerFont(TTFont("BodyCN", FONT))
pdfmetrics.registerFont(TTFont("BoldCN", BOLD))
pdfmetrics.registerFontFamily("BodyCN", normal="BodyCN", bold="BoldCN", italic="BodyCN", boldItalic="BoldCN")

BODY = ParagraphStyle("Body", fontName="BodyCN", fontSize=10, leading=17, textColor=INK,
                      wordWrap="CJK", spaceAfter=6, allowWidows=0, allowOrphans=0)
H1 = ParagraphStyle("H1", parent=BODY, fontName="BoldCN", fontSize=18, leading=26, textColor=TEAL, spaceBefore=4, spaceAfter=16, keepWithNext=True)
H2 = ParagraphStyle("H2", parent=BODY, fontName="BoldCN", fontSize=12, leading=20, spaceBefore=13, spaceAfter=8, keepWithNext=True)
CAPTION = ParagraphStyle("Caption", parent=BODY, fontSize=8.5, leading=13, textColor=MUTED, alignment=TA_CENTER, spaceAfter=12)
SMALL = ParagraphStyle("Small", parent=BODY, fontSize=8, leading=12, spaceAfter=3)
CELL = ParagraphStyle("Cell", parent=BODY, fontSize=8.3, leading=12.6, spaceAfter=0)
CELL_HEAD = ParagraphStyle("CellHead", parent=CELL, fontName="BoldCN", textColor=colors.white)


def inline(text: str) -> str:
    # Preserve text, then add a narrow subset of the Markdown used by this report.
    text = escape(text.strip())
    text = re.sub(r"\[([^\]]+)\]\((https?://[^\)]+)\)", r'<link href="\2" color="#0F766E">\1</link>', text)
    text = re.sub(r"`([^`]+)`", r'<font color="#0F766E">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r'<b>\1</b>', text)
    return text


def para(text: str, style=BODY) -> Paragraph:
    return Paragraph(inline(text), style)


class Figure(Flowable):
    """An image viewport that can show consecutive parts of a long UI screenshot."""

    def __init__(self, path: Path, max_width: float, max_height: float, start_pixel=0, end_pixel=None):
        super().__init__()
        with PILImage.open(path) as image:
            self.pixel_width, self.pixel_height = image.size
        self.path = path
        self.start_pixel = start_pixel
        visible_height = (end_pixel if end_pixel is not None else self.pixel_height) - start_pixel
        self.scale = min(max_width / self.pixel_width, max_height / visible_height)
        self.width = self.pixel_width * self.scale
        self.height = visible_height * self.scale
        self.hAlign = "CENTER"

    def draw(self):
        self.canv.saveState()
        clip = self.canv.beginPath()
        clip.rect(0, 0, self.width, self.height)
        self.canv.clipPath(clip, stroke=0, fill=0)
        total_height = self.pixel_height * self.scale
        self.canv.drawImage(ImageReader(str(self.path)), 0, self.height - total_height + self.start_pixel * self.scale,
                            width=self.width, height=total_height, preserveAspectRatio=True, mask="auto")
        self.canv.restoreState()


def page_decoration(canvas, doc):
    w, h = canvas._pagesize
    canvas.saveState()
    canvas.setStrokeColor(TEAL)
    canvas.setLineWidth(1)
    canvas.line(42, h - 36, w - 42, h - 36)
    canvas.setFont("BodyCN", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, h - 28, "软件工程 / 实验二：软件设计与建模")
    canvas.drawRightString(w - 42, h - 28, "多人共享记账系统")
    canvas.setStrokeColor(LINE)
    canvas.line(42, 34, w - 42, 34)
    canvas.drawString(42, 22, "241220051 沈思涵")
    canvas.drawRightString(w - 42, 22, str(doc.page))
    canvas.restoreState()


def make_template(name, size):
    width, height = size
    frame = Frame(42, 48, width - 84, height - 100, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    return PageTemplate(id=name, frames=[frame], pagesize=size, onPage=page_decoration)


def md_table(lines):
    rows = [[part.strip() for part in line.strip().strip("|").split("|")] for line in lines]
    rows = [row for row in rows if not all(re.fullmatch(r":?-+:?", cell) for cell in row)]
    count = len(rows[0])
    width = A4[0] - 84
    if count == 2:
        widths = [width * .27, width * .73]
    elif count == 3:
        widths = [width * .22, width * .36, width * .42]
    elif count == 4:
        widths = [width * .09, width * .32, width * .28, width * .31]
    else:
        widths = [width / count] * count
    data = [[para(cell, CELL_HEAD if index == 0 else CELL) for cell in row] for index, row in enumerate(rows)]
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT", splitByRow=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAF9")]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, 0), .5, TEAL),
        ("LINEBELOW", (0, 1), (-1, -1), .35, LINE),
    ]))
    return [table, Spacer(1, 10)]


IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def image_block(caption, target, width=None):
    path = ROOT / target
    with PILImage.open(path) as image:
        pixel_width, pixel_height = image.size
    # Desktop UI uses a landscape page so body text in the screenshot stays readable.
    if pixel_width > 1200:
        parts = 2 if pixel_height > pixel_width * 1.1 else 1
        result = []
        for index in range(parts):
            start, end = round(pixel_height * index / parts), round(pixel_height * (index + 1) / parts)
            label = caption + (f"（{index + 1}/{parts}）" if parts > 1 else "")
            result.extend([NextPageTemplate("uiwide"), PageBreak(),
                           Figure(path, landscape(A3)[0] - 84, landscape(A3)[1] - 150, start, end),
                           Spacer(1, 8), para(label, CAPTION)])
        result.extend([NextPageTemplate("body"), PageBreak()])
        return result
    parts = max(1, math.ceil(pixel_height / (pixel_width * 2.2)))
    boundaries = [0]
    with PILImage.open(path) as image:
        rgb = image.convert("RGB")
        for index in range(1, parts):
            ideal = round(pixel_height * index / parts)
            radius = round(pixel_width * .15)
            candidates = sorted(range(max(ideal - radius, boundaries[-1] + 1), min(ideal + radius, pixel_height - 1)), key=lambda y: abs(y - ideal))
            # Cut in a blank horizontal strip, keeping text and controls intact.
            cut = next((y for y in candidates if min(low for low, high in rgb.crop((20, y - 3, pixel_width - 20, y + 4)).getextrema()) > 210), ideal)
            boundaries.append(cut)
    boundaries.append(pixel_height)
    cells = []
    for index in range(parts):
        start, end = boundaries[index:index + 2]
        label = caption + (f"（{index + 1}/{parts}）" if parts > 1 else "")
        cells.append([Figure(path, 240 if parts > 1 else 250, 550, start, end),
                      Spacer(1, 6), para(label, CAPTION)])
    result = []
    for index in range(0, parts, 2):
        pair = cells[index:index + 2]
        if len(pair) == 1:
            result.append(KeepTogether(pair[0]))
        else:
            column = (A4[0] - 84) / 2
            gallery = Table([pair], colWidths=[column, column], hAlign="CENTER")
            gallery.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                                        ("LEFTPADDING", (0, 0), (-1, -1), 4),
                                        ("RIGHTPADDING", (0, 0), (-1, -1), 4)]))
            result.append(gallery)

    return result


def diagram_block(heading, block):
    image_line = next(line for line in block if IMAGE_RE.fullmatch(line.strip()))
    caption, target = IMAGE_RE.fullmatch(image_line.strip()).groups()
    name = Path(target).name
    if name in {"UML类图.png", "UML组件图.png"}:
        template, size = "wide", landscape(A2)
    elif name in {"UML用例图.png", "UML活动图_审核流程.png", "UML时序图_审核通过.png"}:
        template, size = "tall", A2
    elif name == "UML部署图.png":
        template, size = "medium", A3
    else:
        template, size = "body", A4
    width, height = size
    is_large = template != "body"
    text_style = ParagraphStyle("DiagramText", parent=BODY, fontSize=13 if is_large else 10, leading=21 if is_large else 17)
    title_style = ParagraphStyle("DiagramTitle", parent=H1, fontSize=23 if is_large else 16, leading=32 if is_large else 24)
    available_height = height - 320 if is_large else 400
    result = [NextPageTemplate(template), PageBreak(), para(heading, title_style)]
    result += [Figure(ROOT / target, width - 84, available_height), Spacer(1, 10), para(caption, CAPTION)]
    for line in block:
        if line.strip() and line != image_line:
            result.append(para(line, text_style))
    result += [NextPageTemplate("body"), PageBreak()]
    return result


class ScreenshotThumbnail(Flowable):
    """A fixed preview tile; complete screenshots remain separate attachments."""
    def __init__(self, target, width, height):
        super().__init__()
        self.width, self.height = width, height
        with PILImage.open(ROOT / target) as image:
            end = min(image.height, round(image.width * 2.15)) if image.width < 1200 else image.height
        self.figure = Figure(ROOT / target, width - 4, height - 4, end_pixel=end)

    def draw(self):
        self.canv.saveState()
        self.canv.setStrokeColor(LINE)
        self.canv.rect(0, 0, self.width, self.height, stroke=1, fill=0)
        self.figure.drawOn(self.canv, (self.width - self.figure.width) / 2,
                           self.height - self.figure.height - 2)
        self.canv.restoreState()


def ui_overview_block(heading, block):
    entries = [IMAGE_RE.fullmatch(line.strip()).groups() for line in block
               if IMAGE_RE.fullmatch(line.strip())]
    column = (landscape(A4)[0] - 84) / 3
    cells = [[ScreenshotThumbnail(target, column - 12, 180), Spacer(1, 5),
              para(caption, CAPTION)] for caption, target in entries]
    while len(cells) % 3:
        cells.append("")
    rows = [cells[index:index + 3] for index in range(0, len(cells), 3)]
    gallery = Table(rows, colWidths=[column] * 3, hAlign="CENTER")
    gallery.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    return [NextPageTemplate("gallery"), PageBreak(), para(heading, H1), gallery,
            NextPageTemplate("body"), PageBreak()]


def build():
    lines = SOURCE.read_text().splitlines()
    split = lines.index("<!-- pagebreak -->")
    story = [Spacer(1, 35), para("SOFTWARE ENGINEERING / LAB 02", CAPTION), Spacer(1, 24)]
    cover_title = ParagraphStyle("CoverTitle", parent=H1, fontSize=27, leading=40, alignment=TA_CENTER)
    cover_subtitle = ParagraphStyle("CoverSubtitle", parent=H1, fontSize=21, leading=32, alignment=TA_CENTER)
    story += [para("实验二：软件设计与建模", cover_title), Spacer(1, 18), para("多人共享记账系统", cover_subtitle), Spacer(1, 25)]
    for line in lines[4:split]:
        if line.strip():
            style = BODY if len(line) > 70 else ParagraphStyle("CoverMeta", parent=BODY, alignment=TA_CENTER, spaceAfter=8)
            story.append(para(line, style))
    story += [PageBreak()]
    i = split + 1
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.startswith("### 5.") and "界面总览" in line:
            end = i + 1
            while end < len(lines) and lines[end].strip() != "<!-- /ui-overview -->":
                end += 1
            if story and isinstance(story[-1], PageBreak):
                story.pop()
                if story and isinstance(story[-1], NextPageTemplate):
                    story.pop()
            story.extend(ui_overview_block(line[4:], lines[i + 1:end]))
            i = end + 1
            continue
        if line.startswith("### 4.") and not line.startswith("### 4.1 "):
            end = i + 1
            while end < len(lines) and not lines[end].startswith("##"):
                end += 1
            if isinstance(story[-1], PageBreak):
                story.pop()
                if isinstance(story[-1], NextPageTemplate):
                    story.pop()
            story.extend(diagram_block(line[4:], lines[i + 1:end]))
            i = end
            continue
        if line.startswith("## "):
            if line[3:] in {"四、UML建模", "五、各功能模块UI设计", "六、AI辅助工具使用与本人思考"} and story and not isinstance(story[-1], PageBreak):
                story.append(PageBreak())
            story.append(para(line[3:], H1))
        elif line.startswith("### "):
            story.append(para(line[4:], H2))
        elif line.startswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            story.extend(md_table(table_lines))
            continue
        elif line.startswith("```"):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            for code_line in code:
                story.append(Paragraph(escape(code_line).replace(" ", "&#160;"), SMALL))
            story.append(Spacer(1, 8))
        elif IMAGE_RE.fullmatch(line):
            caption, target = IMAGE_RE.fullmatch(line).groups()
            with PILImage.open(ROOT / target) as image:
                wide = image.width > 1200
            if wide and story and isinstance(story[-1], PageBreak):
                story.pop()
                if story and isinstance(story[-1], NextPageTemplate):
                    story.pop()
            story.extend(image_block(caption, target))
        elif line.startswith("- "):
            story.append(Paragraph("• " + inline(line[2:]), BODY))
        elif line == "<!-- pagebreak -->":
            story.append(PageBreak())
        else:
            story.append(para(line))
        i += 1
    if isinstance(story[-1], PageBreak):
        story.pop()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, title="实验二：软件设计与建模 - 多人共享记账系统", author="沈思涵")
    doc.addPageTemplates([make_template("body", A4), make_template("gallery", landscape(A4)), make_template("uiwide", landscape(A3)), make_template("wide", landscape(A2)), make_template("tall", A2), make_template("medium", A3)])
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
