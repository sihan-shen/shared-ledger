#!/usr/bin/env python3
"""Generate React + SDS tokens (Tokens Studio / DTCG / CSS / Tailwind)."""
from __future__ import annotations
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent

brand = {
    "50": "#F0FDFA", "100": "#CCFBF1", "200": "#99F6E4", "300": "#5EEAD4",
    "400": "#2DD4BF", "500": "#14B8A6", "600": "#0F766E", "700": "#115E59",
    "800": "#134E4A", "900": "#042F2E",
}
neutral = {
    "0": "#FFFFFF", "50": "#FAFAFA", "100": "#F5F5F5", "200": "#E6E6E6",
    "300": "#D9D9D9", "400": "#B3B3B3", "500": "#757575", "600": "#444444",
    "700": "#383838", "800": "#2C2C2C", "900": "#1E1E1E", "1000": "#111111",
}
status = {
    "pending": "#D97706", "pendingSoft": "#FFFBEB",
    "success": "#16A34A", "successSoft": "#F0FDF4",
    "danger": "#DC2626", "dangerSoft": "#FEF2F2",
    "info": "#0284C7", "infoSoft": "#F0F9FF",
}
semantic = {
    "brand": "{color.brand.600}",
    "brandHover": "{color.brand.700}",
    "brandSoft": "{color.brand.50}",
    "textPrimary": "{color.neutral.1000}",
    "textSecondary": "{color.neutral.600}",
    "textTertiary": "{color.neutral.500}",
    "textInverse": "{color.neutral.0}",
    "bgPage": "{color.neutral.50}",
    "bgCard": "{color.neutral.0}",
    "bgSubtle": "{color.neutral.100}",
    "border": "{color.neutral.200}",
    "borderStrong": "{color.neutral.300}",
    "statePending": "{color.status.pending}",
    "stateSuccess": "{color.status.success}",
    "stateDanger": "{color.status.danger}",
    "stateInfo": "{color.status.info}",
    "overlay": "#11111166",
}
resolved = {
    "brand": brand["600"], "brandHover": brand["700"], "brandSoft": brand["50"],
    "textPrimary": neutral["1000"], "textSecondary": neutral["600"], "textTertiary": neutral["500"],
    "textInverse": neutral["0"], "bgPage": neutral["50"], "bgCard": neutral["0"],
    "bgSubtle": neutral["100"], "border": neutral["200"], "borderStrong": neutral["300"],
    "statePending": status["pending"], "stateSuccess": status["success"],
    "stateDanger": status["danger"], "stateInfo": status["info"], "overlay": "#11111166",
}
scale = {
    "caption": (12, 18), "label": (14, 20), "body": (16, 24),
    "h3": (20, 28), "h2": (24, 32), "h1": (32, 40),
}
weight = {"caption": "regular", "label": "medium", "body": "regular", "h3": "semibold", "h2": "semibold", "h1": "bold"}
spacing = {"0": 0, "1": 4, "2": 8, "3": 12, "4": 16, "6": 24, "8": 32, "12": 48}
radius = {"sm": 4, "md": 8, "lg": 12, "full": 999}
sizes = {"touch": 44, "button": 40, "input": 40, "sidebar": 240, "content": 1200}
shadow = {"focus": "0 0 0 2px rgba(20,184,166,0.35)"}
opacity = {"disabled": 0.48, "muted": 0.64, "overlay": 0.40}

status_kebab = {"pending": "pending", "pendingSoft": "pending-soft", "success": "success", "successSoft": "success-soft", "danger": "danger", "dangerSoft": "danger-soft", "info": "info", "infoSoft": "info-soft"}
sem_kebab = {"brand": "brand", "brandHover": "brand-hover", "brandSoft": "brand-soft", "textPrimary": "text-primary", "textSecondary": "text-secondary", "textTertiary": "text-tertiary", "textInverse": "text-inverse", "bgPage": "bg-page", "bgCard": "bg-card", "bgSubtle": "bg-subtle", "border": "border", "borderStrong": "border-strong", "statePending": "state-pending", "stateSuccess": "state-success", "stateDanger": "state-danger", "stateInfo": "state-info", "overlay": "overlay"}

# Tokens Studio legacy
g = {}
g["color"] = {
    "brand": {k: {"value": v, "type": "color"} for k, v in brand.items()},
    "neutral": {k: {"value": v, "type": "color"} for k, v in neutral.items()},
    "status": {k: {"value": v, "type": "color"} for k, v in status.items()},
    "semantic": {k: {"value": v, "type": "color"} for k, v in semantic.items()},
}
g["font"] = {
    "family": {"sans": {"value": "Inter", "type": "fontFamilies"}},
    "weight": {
        "regular": {"value": "400", "type": "fontWeights"},
        "medium": {"value": "500", "type": "fontWeights"},
        "semibold": {"value": "600", "type": "fontWeights"},
        "bold": {"value": "700", "type": "fontWeights"},
    },
    "size": {k: {"value": str(v[0]), "type": "fontSizes"} for k, v in scale.items()},
    "lineHeight": {k: {"value": str(v[1]), "type": "lineHeights"} for k, v in scale.items()},
}
g["space"] = {k: {"value": str(v), "type": "spacing"} for k, v in spacing.items()}
g["radius"] = {k: {"value": str(v), "type": "borderRadius"} for k, v in radius.items()}
g["size"] = {k: {"value": str(v), "type": "sizing"} for k, v in sizes.items()}
g["borderWidth"] = {"default": {"value": "1", "type": "borderWidth"}}
g["opacity"] = {k: {"value": v, "type": "opacity"} for k, v in opacity.items()}
g["shadow"] = {"focus": {"value": {"x": 0, "y": 0, "blur": 0, "spread": 2, "color": "rgba(20,184,166,0.35)", "type": "dropShadow"}, "type": "boxShadow"}}
g["typography"] = {
    k: {"value": {
        "fontFamily": "{font.family.sans}",
        "fontWeight": "{font.weight.%s}" % weight[k],
        "fontSize": "{font.size.%s}" % k,
        "lineHeight": "{font.lineHeight.%s}" % k,
        "letterSpacing": "0",
    }, "type": "typography"}
    for k in scale
}
ts = {"global": g}

# DTCG
def dim(v): return {"value": v, "unit": "px"}
d = {}
d["color"] = {"$type": "color", "brand": {k: {"$value": v} for k, v in brand.items()}, "neutral": {k: {"$value": v} for k, v in neutral.items()}, "status": {k: {"$value": v} for k, v in status.items()}, "semantic": {k: {"$value": v} for k, v in semantic.items()}}
d["fontFamily"] = {"$type": "fontFamily", "sans": {"$value": ["Inter", "Noto Sans SC", "Noto Sans CJK SC", "sans-serif"]}}
d["fontWeight"] = {"$type": "fontWeight", "regular": {"$value": 400}, "medium": {"$value": 500}, "semibold": {"$value": 600}, "bold": {"$value": 700}}
d["fontSize"] = {"$type": "dimension", **{k: {"$value": dim(v[0])} for k, v in scale.items()}}
d["lineHeight"] = {"$type": "dimension", **{k: {"$value": dim(v[1])} for k, v in scale.items()}}
d["space"] = {"$type": "dimension", **{k: {"$value": dim(v)} for k, v in spacing.items()}}
d["radius"] = {"$type": "dimension", **{k: {"$value": dim(v)} for k, v in radius.items()}}
d["size"] = {"$type": "dimension", **{k: {"$value": dim(v)} for k, v in sizes.items()}}
d["borderWidth"] = {"$type": "dimension", "default": {"$value": dim(1)}}
d["opacity"] = {"$type": "number", **{k: {"$value": v} for k, v in opacity.items()}}
d["shadow"] = {"$type": "shadow", "focus": {"$value": {"color": "#14B8A659", "offsetX": dim(0), "offsetY": dim(0), "blur": dim(0), "spread": dim(2)}}}
d["typography"] = {"$type": "typography", **{k: {"$value": {"fontFamily": "{fontFamily.sans}", "fontWeight": "{fontWeight.%s}" % weight[k], "fontSize": "{fontSize.%s}" % k, "lineHeight": "{lineHeight.%s}" % k, "letterSpacing": dim(0)}} for k in scale}}

# CSS
css = [":root {"]
for k, v in brand.items(): css.append(f"  --sds-color-brand-{k}: {v};")
for k, v in neutral.items(): css.append(f"  --sds-color-neutral-{k}: {v};")
for k, v in status.items(): css.append(f"  --sds-color-status-{status_kebab[k]}: {v};")
for k, v in semantic.items():
    key = sem_kebab[k]
    if v.startswith("{color."):
        css.append(f"  --sds-color-{key}: var(--sds-{v[1:-1].replace('.', '-')});")
    else:
        css.append(f"  --sds-color-{key}: {v};")
css += ['  --sds-font-sans: "Inter", "Noto Sans SC", "Noto Sans CJK SC", sans-serif;']
for k, (sz, lh) in scale.items():
    css += [f"  --sds-text-{k}-size: {sz}px;", f"  --sds-text-{k}-line: {lh}px;"]
for k, v in spacing.items(): css.append(f"  --sds-space-{k}: {v}px;")
for k, v in radius.items(): css.append(f"  --sds-radius-{k}: {v}px;")
for k, v in sizes.items(): css.append(f"  --sds-size-{k}: {v}px;")
css += ["  --sds-border-width: 1px;", "  --sds-shadow-focus: 0 0 0 2px rgba(20,184,166,0.35);"]
for k, v in opacity.items(): css.append(f"  --sds-opacity-{k}: {v};")
css.append("}")
theme_css = "\n".join(css) + "\n"

tw_theme = {
    "colors": {"brand": brand, "neutral": neutral, "status": {status_kebab[k]: v for k, v in status.items()}, "semantic": {sem_kebab[k]: v for k, v in resolved.items()}},
    "fontFamily": {"sans": ["Inter", "Noto Sans SC", "Noto Sans CJK SC", "sans-serif"]},
    "fontSize": {k: [f"{v[0]}px", {"lineHeight": f"{v[1]}px"}] for k, v in scale.items()},
    "fontWeight": {"regular": "400", "medium": "500", "semibold": "600", "bold": "700"},
    "spacing": {k: f"{v}px" for k, v in spacing.items()},
    "borderRadius": {k: f"{v}px" for k, v in radius.items()},
    "borderWidth": {"DEFAULT": "1px"},
    "boxShadow": shadow,
    "opacity": {k: str(v) for k, v in opacity.items()},
}
tw = "// Generated from docs/lab2/tokens/react-sds/generate.py\nmodule.exports = { theme: { extend: " + json.dumps(tw_theme, ensure_ascii=False, indent=2).replace("\n", "\n    ") + " } };\n"

tw4 = ["@theme {"]
for k, v in brand.items(): tw4.append(f"  --color-brand-{k}: {v};")
for k, v in neutral.items(): tw4.append(f"  --color-neutral-{k}: {v};")
for k, v in status.items(): tw4.append(f"  --color-status-{status_kebab[k]}: {v};")
for k, v in resolved.items(): tw4.append(f"  --color-semantic-{sem_kebab[k]}: {v};")
tw4.append('  --font-sans: "Inter", "Noto Sans SC", "Noto Sans CJK SC", sans-serif;')
for k, (sz, lh) in scale.items():
    tw4 += [f"  --text-{k}: {sz}px;", f"  --text-{k}--line-height: {lh}px;"]
for k, v in spacing.items(): tw4.append(f"  --spacing-{k}: {v}px;")
for k, v in radius.items(): tw4.append(f"  --radius-{k}: {v}px;")
tw4.append("  --shadow-focus: 0 0 0 2px rgba(20,184,166,0.35);")
for k, v in opacity.items(): tw4.append(f"  --opacity-{k}: {v};")
tw4.append("}")
tw4_css = "\n".join(tw4) + "\n"

files = {
    "react-sds.tokens-studio.json": json.dumps(ts, ensure_ascii=False, indent=2) + "\n",
    "react-sds.dtcg.json": json.dumps(d, ensure_ascii=False, indent=2) + "\n",
    "sds-theme.css": theme_css,
    "tailwind.config.js": tw,
    "tailwind-theme.css": tw4_css,
}
for n, c in files.items(): (OUT / n).write_text(c, encoding="utf-8")
print("written:", ", ".join(files))
