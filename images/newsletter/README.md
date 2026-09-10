# Newsletter image library

Drop purpose-cropped images for MailerLite newsletters here, then register each one
in `../newsletter-assets.json`. The `lbt-newsletter` agent reads that manifest and
inserts real hosted URLs instead of upload placeholders.

## How it works

1. Add the image file to this folder (or anywhere under `images/`).
2. Commit and push. The file goes live at
   `https://luxebeautytrip.com/images/newsletter/<filename>` (or
   `https://luxebeautytrip.com/images/<filename>` if you put it at the images root).
3. Add an entry to `images/newsletter-assets.json` with: `file`, `url`, `w`, `h`,
   `bytes`, `desc`, `alt`, `slots`, `tags`.
4. Next time you ask for a newsletter, the agent matches sections to images by tag.

## Crop targets

| Slot   | Size    | Ratio | Use |
|--------|---------|-------|-----|
| logo   | 120 wide | keep native | header wordmark |
| hero   | 540 x 300 | ~1.8:1 | top-of-email image |
| inline | 504 x 260 | ~1.9:1 | image between body sections |
| strip  | 200 x 150 | ~1.33:1 | optional 3-across strip near footer |

Export at 2x (e.g. hero at 1080 x 600) for retina, keep each file under ~1 MB.

## Rules the agent follows

- HTTPS URLs only, never local paths.
- Ratio within ~10% of the slot: use the slot's width and height.
- Ratio further off: set width only, let height scale. No forced squishing.
- No clear tag match for a slot: leave the upload placeholder, do not force a weak image.
- Files over ~1 MB get flagged in the placeholder notes.

## Tag vocabulary (extend as needed)

Treatment: `laser` `toning` `pigmentation` `melasma` `microneedling` `skinbooster`
`lifting` `firming` `ultherapy` `thermage` `led` `resurfacing` `peel` `thread-lift`
`device` `consultation` `practitioner`

Mood / stage: `calm` `recovery` `rest` `downtime` `low-downtime` `before` `finish`

Travel / experience: `seoul` `clinic` `room` `interior` `spa` `jjimjilbang`
`colour-analysis` `shopping` `food` `dining` `culture` `sightseeing` `itinerary`
`neighbourhood`

Brand: `logo` `brand` `founders` `generic` `fallback`
