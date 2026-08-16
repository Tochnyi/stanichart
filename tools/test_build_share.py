"""Focused tests for build-share.py.

Run with: python -m unittest tools/test_build_share.py
"""

import importlib.util
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "build-share.py"
SPEC = importlib.util.spec_from_file_location("stanichart_build_share", MODULE_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"Unable to load {MODULE_PATH}")
BUILD_SHARE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILD_SHARE)


SOURCE_HTML = """<!DOCTYPE html>
<html><head>
<link rel="stylesheet" href="../../lib/tochnyi.css">
<script src="../../lib/tochnyi-charts.js"></script>
</head><body>
<img src="../../lib/tochnyi-logo.png" alt="Logo">
<img src="../../lib/watermark.svg" class="tochnyi-watermark small" alt="Watermark">
</body></html>
"""


class BuildShareTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="stanichart-build-share-")
        self.root = Path(self.temporary.name)
        self.lib = self.root / "lib"
        self.lib.mkdir()
        (self.lib / "tochnyi.css").write_text("body { color: #111; }", encoding="utf-8")
        (self.lib / "tochnyi-charts.js").write_text("window.Tochnyi = {};", encoding="utf-8")
        (self.lib / "tochnyi-logo.png").write_bytes(b"test-png")
        (self.lib / "watermark.svg").write_text(
            '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg">'
            '<style>.cls-1{fill:#fff}</style><path class="cls-1"/></svg>',
            encoding="utf-8",
        )
        self.chart = self.root / "chart.html"
        self.share = self.root / "chart-share.html"

    def tearDown(self):
        self.temporary.cleanup()

    def hidden_work_files(self):
        return [path.name for path in self.root.iterdir() if path.name.startswith(".")]

    def test_success_replaces_existing_share_only_after_complete_inlining(self):
        self.chart.write_text(SOURCE_HTML, encoding="utf-8")
        self.share.write_text("old share", encoding="utf-8")

        dst, counts = BUILD_SHARE.build_share(self.chart, self.lib)

        self.assertEqual(dst, self.share)
        self.assertEqual(counts, {"css": 1, "js": 1, "logo": 1, "watermark": 1})
        result = self.share.read_text(encoding="utf-8")
        self.assertIn("<style>", result)
        self.assertIn("data:image/png;base64,", result)
        self.assertIn('class="tochnyi-watermark small"', result)
        self.assertNotIn("../../lib/", result)
        self.assertEqual(self.hidden_work_files(), [])

    def test_remaining_local_reference_rejects_build_without_overwriting_prior_share(self):
        drifted = SOURCE_HTML.replace(
            'href="../../lib/tochnyi.css"',
            'href="../../../lib/tochnyi.css"',
        )
        self.chart.write_text(drifted, encoding="utf-8")
        self.share.write_text("old share", encoding="utf-8")

        with self.assertRaisesRegex(ValueError, "local chart asset references remain"):
            BUILD_SHARE.build_share(self.chart, self.lib)

        self.assertEqual(self.share.read_text(encoding="utf-8"), "old share")
        self.assertEqual(self.hidden_work_files(), [])

    def test_zero_replacement_input_rejects_build_without_overwriting_prior_share(self):
        self.chart.write_text("<html><body>already standalone</body></html>", encoding="utf-8")
        self.share.write_text("old share", encoding="utf-8")

        with self.assertRaisesRegex(ValueError, "no local chart assets were inlined"):
            BUILD_SHARE.build_share(self.chart, self.lib)

        self.assertEqual(self.share.read_text(encoding="utf-8"), "old share")
        self.assertEqual(self.hidden_work_files(), [])

    def test_publication_failure_cleans_staging_and_preserves_directory_destination(self):
        self.chart.write_text(SOURCE_HTML, encoding="utf-8")
        self.share.mkdir()
        sentinel = self.share / "sentinel.txt"
        sentinel.write_text("preserve", encoding="utf-8")

        with self.assertRaises(OSError):
            BUILD_SHARE.build_share(self.chart, self.lib)

        self.assertEqual(sentinel.read_text(encoding="utf-8"), "preserve")
        self.assertEqual(self.hidden_work_files(), [])


if __name__ == "__main__":
    unittest.main()
