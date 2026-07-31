# Calorie Count

A daily and weekly calorie budget, designed to be driven one-handed in a
supermarket aisle. Static files only — no build step, no backend, no accounts,
and no network calls after the first load. All data stays in your browser's
storage.

Live at **https://coolengineerguy.github.io/**

## Features

- Daily budget with a remaining-today readout and a progress bar
- A daily expenditure (TDEE) ceiling scored alongside it, so an over-budget day
  reads as amber rather than red while the week is still under the real burn
- A shopping list you tick off as you eat, with an "if you finish the list"
  projection of where the day lands against both lines
- Monday-to-Sunday week view: per-day bars, pace against budget, headroom
  against the weekly ceiling, last week's total
- Tap any day's bar for that day's total, its entries, and a keypad to add
  calories you forgot to record at the time
- Installable as a PWA — launcher icon, no address bar, works offline
- CSV and JSON export, JSON restore
- Light and dark themes, following the system setting

## Usage

**Log eaten** records calories against today immediately.

**Add to list** queues an item without logging it. Ticking an item off the list
logs it against the day you ticked it, so the list stays a same-day scratchpad —
anything left on it at midnight is dropped. Nothing is lost by that, because
items only enter the log when ticked. Bought something today to eat tomorrow?
Use **Log eaten** tomorrow rather than the list.

**Tapping a bar** in the week view opens that day: its total, what it leaves
against the budget and the ceiling, and every entry on it. **Add to this day**
puts a number straight onto that date — for the meal you ate but never recorded.
Entries added after the fact are marked `backfill` and show *added later* instead
of a clock time, because the time they were typed isn't the time they were eaten.
Past entries can be deleted from here too, with the same two-tap confirm as the
rest of the app. Future days aren't tappable.

Two numbers are set in Settings, and each is multiplied by seven for the week.
The **daily budget** is what you're aiming at. The **daily expenditure** (TDEE)
is what you actually burn, and its weekly total is the ceiling — the real upper
limit. Going over budget on a day or two is a deliberate choice, so the app
colours it amber; red is reserved for going past the ceiling, where the week is
in genuine surplus. Changing either re-scores every day on display, past ones
included.

Eight weeks of daily records are retained, but only the current and previous
week are ever shown. The extra history exists so the CSV export is worth
something.

## Data

Everything lives in `localStorage` under the key `calcount:v1`, scoped to the
origin serving the app. Nothing is transmitted anywhere.

It survives closing the app, rebooting, and deploying updates. It does not
survive clearing browsing data, uninstalling with the "remove data" option, or
switching browser or phone.

**Export from Settings periodically.** CSV gives one row per entry
(`date, time, kcal, label, source`) for use in a spreadsheet; backfilled entries
have an empty `time`. JSON is a full
backup that **Restore** reads back in, and is the route onto a new phone.

## Installing

Open the site in Chrome on Android and use either the **Install to home screen**
button in Settings or Chrome's ⋮ menu → **Add to Home screen**.

Installing also generally grants persistent storage, meaning the browser will
not evict the data to reclaim space. The Settings panel reports which mode is in
effect.

## Deploying

The repository is named `<user>.github.io`, so GitHub Pages serves it from the
root with **Settings → Pages → Build and deployment** set to **Deploy from a
branch**, branch `main`, folder `/ (root)`. Pushes redeploy in about a minute.

All paths in the app are relative, so it works equally well from a subpath such
as `/calorie-count/` if you'd rather host it under a differently named repo. Any
static host will serve it — Netlify Drop and Cloudflare Pages both accept a
direct folder upload and behave identically.

## Development

There is no toolchain. Edit `index.html` and reload.

`sw.js` serves from cache first and revalidates in the background, so **bump
`VERSION` in `sw.js` whenever you change `index.html`**. Without it, an old copy
may be served for a launch or two; changing `v1` to `v2` discards the previous
cache.

## Files

```
index.html      the entire app — markup, styles, logic
manifest.json   PWA metadata, makes the app installable
sw.js           service worker, offline cache
icons/          launcher and maskable icons, favicon
.nojekyll       stops GitHub Pages running the site through Jekyll
```
