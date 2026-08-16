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
import os
import re
import sys
import tempfile
from pathlib import Path


LOCAL_LIB_REF = re.compile(
    r'(?:src|href)="(?:(?:\.\.?)/)*lib/|'
    r'tochnyi-(?:logo\.png|watermark\.svg|charts\.js)'
)


def transform_chart(html: str, lib_dir: Path) -> tuple[str, dict[str, int]]:
    """Inline local chart assets and reject output that still depends on lib/."""
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

    html, n_css = re.subn(
        r'<link\s+rel="stylesheet"\s+href="\.\./\.\./lib/tochnyi\.css"\s*/?>',
        f"<style>\n{css}\n</style>",
        html,
    )
    html, n_js = re.subn(
        r'<script\s+src="\.\./\.\./lib/tochnyi-charts\.js"\s*></script>',
        f"<script>\n{js}\n</script>",
        html,
    )
    html, n_logo = re.subn(
        r'src="\.\./\.\./lib/tochnyi-logo\.png"',
        f'src="data:image/png;base64,{logo_b64}"',
        html,
    )

    def replace_watermark(match: re.Match) -> str:
        classes = match.group("classes")
        return watermark_svg.replace("<svg ", f'<svg class="{classes}" ', 1)

    html, n_wm = re.subn(
        r'<img\s+src="\.\./\.\./lib/watermark\.svg"\s+class="(?P<classes>[^"]+)"\s+alt="[^"]*"\s*/?>',
        replace_watermark,
        html,
    )

    counts = {"css": n_css, "js": n_js, "logo": n_logo, "watermark": n_wm}
    if not any(counts.values()):
        raise ValueError(
            "no local chart assets were inlined; the source may already be self-contained "
            "or may not use the documented ../../lib/... paths"
        )
    if LOCAL_LIB_REF.search(html):
        raise ValueError(
            "local chart asset references remain after inlining; refusing to publish a "
            "share file that is not self-contained"
        )
    return html, counts


def publish_text_atomic(dst: Path, text: str) -> None:
    """Synchronize a staged sibling before replacing the final share artifact."""
    fd, staged_name = tempfile.mkstemp(
        dir=dst.parent,
        prefix=f".{dst.name}.",
        suffix=".tmp",
        text=True,
    )
    staged = Path(staged_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(staged, dst)
    except Exception as error:
        try:
            staged.unlink(missing_ok=True)
        except OSError as cleanup_error:
            raise RuntimeError(
                f"{error}; staged share file cleanup also failed: {cleanup_error}"
            ) from error
        raise


def build_share(src: Path, lib_dir: Path) -> tuple[Path, dict[str, int]]:
    """Build and publish one validated self-contained share artifact."""
    html = src.read_text(encoding="utf-8")
    transformed, counts = transform_chart(html, lib_dir)
    dst = src.with_name(src.stem + "-share.html")
    publish_text_atomic(dst, transformed)
    return dst, counts


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

    try:
        dst, counts = build_share(src, lib_dir)
    except (OSError, UnicodeError, ValueError, RuntimeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    size_kb = dst.stat().st_size / 1024
    print(f"Wrote {dst} ({size_kb:.1f} KB)")
    print(
        "  inlined: "
        f"css={counts['css']}, js={counts['js']}, "
        f"logo={counts['logo']}, watermark={counts['watermark']}"
    )
    print("  note: AMCharts + Google Fonts still load from CDN (needs internet).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
