#!/usr/bin/env python3
"""
Build a self-contained, shareable version of a Tochnyi chart.

Inlines the four local dependencies (CSS, JS helper, logo PNG, watermark SVG)
so the resulting HTML works as a standalone file. AMCharts and Google Fonts
are still loaded from CDN — the chart won't render offline.

Usage:
    python build-share.py charts/2026-week-18/my-chart.html

Produces:
    charts/2026-week-18/my-chart-share.html
"""
import base64
import re
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <path/to/chart.html>", file=sys.stderr)
        return 2

    src = Path(sys.argv[1])
    if not src.is_file():
        print(f"Error: file not found: {src}", file=sys.stderr)
        return 1

    repo_root = Path(__file__).resolve().parent
    lib_dir = repo_root / "lib"
    if not lib_dir.is_dir():
        print(f"Error: lib/ not found at {lib_dir}", file=sys.stderr)
        return 1

    html = src.read_text(encoding="utf-8")
    css = (lib_dir / "tochnyi.css").read_text(encoding="utf-8")
    js = (lib_dir / "tochnyi-charts.js").read_text(encoding="utf-8")
    logo_b64 = base64.b64encode(
        (lib_dir / "tochnyi-logo.png").read_bytes()
    ).decode("ascii")

    watermark_svg = (lib_dir / "watermark.svg").read_text(encoding="utf-8")
    watermark_svg = re.sub(r"<\?xml[^>]*\?>\s*", "", watermark_svg)
    # Namespace the SVG's internal CSS classes so they can't collide with
    # anything in tochnyi.css.
    watermark_svg = re.sub(r"\.cls-(\d)", r".wm-cls-\1", watermark_svg)
    watermark_svg = re.sub(r'class="cls-(\d)"', r'class="wm-cls-\1"', watermark_svg)

    # 1. Inline tochnyi.css
    html, n_css = re.subn(
        r'<link\s+rel="stylesheet"\s+href="\.\./\.\./lib/tochnyi\.css"\s*/?>',
        f"<style>\n{css}\n</style>",
        html,
    )

    # 2. Inline tochnyi-charts.js
    html, n_js = re.subn(
        r'<script\s+src="\.\./\.\./lib/tochnyi-charts\.js"\s*></script>',
        f"<script>\n{js}\n</script>",
        html,
    )

    # 3. Inline logo PNG as data URI (handles all occurrences)
    html, n_logo = re.subn(
        r'src="\.\./\.\./lib/tochnyi-logo\.png"',
        f'src="data:image/png;base64,{logo_b64}"',
        html,
    )

    # 4. Replace each <img ... watermark.svg ...> with the inline SVG,
    #    preserving the img tag's class attribute (e.g., "tochnyi-watermark small").
    def replace_watermark(match: re.Match) -> str:
        classes = match.group("classes")
        return watermark_svg.replace(
            "<svg ", f'<svg class="{classes}" ', 1
        )

    html, n_wm = re.subn(
        r'<img\s+src="\.\./\.\./lib/watermark\.svg"\s+class="(?P<classes>[^"]+)"\s+alt="[^"]*"\s*/?>',
        replace_watermark,
        html,
    )

    dst = src.with_name(src.stem + "-share.html")
    dst.write_text(html, encoding="utf-8")

    size_kb = dst.stat().st_size / 1024
    print(f"Wrote {dst} ({size_kb:.1f} KB)")
    print(
        f"  inlined: css={n_css}, js={n_js}, logo={n_logo}, watermark={n_wm}"
    )
    if n_css == 0 and n_js == 0 and n_logo == 0 and n_wm == 0:
        print(
            "  warning: no replacements made — is the chart already self-contained,",
            file=sys.stderr,
        )
        print(
            "  or are the lib/ paths different from '../../lib/...'?",
            file=sys.stderr,
        )
    print("  note: AMCharts + Google Fonts still load from CDN (needs internet).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
