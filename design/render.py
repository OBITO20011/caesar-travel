"""Render Caesar Travel posters from a JSON post file.

Usage:
    python design/render.py design/data/<post>.json

Each entry in "outputs" picks a template (design/templates/<name>.html) and a
format (feed 1080x1350, story 1080x1920, square 1080x1080). PNGs land in
design/out/. Paths in the JSON (photo) are relative to the repo root.
"""
import json
import pathlib
import sys

from playwright.sync_api import sync_playwright

DESIGN = pathlib.Path(__file__).resolve().parent
REPO = DESIGN.parent
SIZES = {"feed": (1080, 1350), "story": (1080, 1920), "square": (1080, 1080)}


def render(post_file: pathlib.Path) -> list[pathlib.Path]:
    data = json.loads(post_file.read_text(encoding="utf-8"))
    out_dir = DESIGN / "out"
    out_dir.mkdir(exist_ok=True)
    written = []
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
        except Exception:
            # Bundled browser missing: use Microsoft Edge (preinstalled on Windows).
            browser = p.chromium.launch(channel="msedge")
        for job in data["outputs"]:
            post = {k: v for k, v in data.items() if k != "outputs"} | job
            post["photo"] = (REPO / post["photo"]).resolve().as_uri()
            post["logo_white"] = (DESIGN / "brand/logo-white.png").as_uri()
            post["logo_navy"] = (DESIGN / "brand/logo-navy.png").as_uri()
            w, h = SIZES[job["format"]]
            page = browser.new_page(viewport={"width": w, "height": h})
            page.add_init_script(f"window.POST = {json.dumps(post, ensure_ascii=False)};")
            page.goto((DESIGN / "templates" / f"{job['template']}.html").as_uri())
            page.wait_for_function("window.__ready === true", timeout=30000)
            out = out_dir / f"{data['slug']}-{job['template']}-{job['format']}.png"
            page.screenshot(path=str(out))
            page.close()
            written.append(out)
        browser.close()
    return written


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    for path in render(pathlib.Path(sys.argv[1])):
        print(path)
