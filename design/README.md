# Caesar Travel - poster studio

Posters are HTML templates filled from a JSON file and rendered to PNG with
Playwright (real Chromium/Edge, so Arabic shaping and RTL are correct).

```bash
python design/render.py design/data/rj-makkah-sample.json
```

Output: `design/out/<slug>-<template>-<format>.png`.

## Identity

| Token | Value | Use |
| --- | --- | --- |
| Navy | `#253066` (from the logo) | Titles, prices, footer |
| Navy deep | `#1a2350` | Gradients, night posters |
| White / ivory | `#ffffff` / `#fbf8f2` | Text on photos, cards |
| Beige / sand | `#f4ede1` / `#e6d8bf` | Calm backgrounds, glass tint, tags |
| Logo yellow | `#eeb300` | Small accents only |
| Font | Tajawal (400-900) | Everything |

Glass panel = beige-tinted white at ~70% + `backdrop-filter: blur(22px)` over a
real photo. Logo files in `brand/` were cut from the 960px logo image; replace
them with the original vector when available.

## Templates

| Template | Formats | For |
| --- | --- | --- |
| `program` | feed 1080x1350, story 1080x1920 | Program with hotels + price table (quad/triple/double, never single) |
| `offer` | feed, story | One headline "from X JOD per person" price |

## New post

Copy a file in `data/`, change the fields, list the outputs you want, run
`render.py`. Rules: facts and prices only from the owner; breakfast tag only for
hotels that include it; WhatsApp 0798337711 as the main number; real photos only
(no AI images) and keep the credit line for licensed photos.
