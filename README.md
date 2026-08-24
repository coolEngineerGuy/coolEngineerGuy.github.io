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
- A keypad that takes × and ÷ as well as digits, for the sums packaging forces
  on you — 4 × 96 for a multipack, 132 ÷ 30 × 35 to scale a per-100 g figure
- Saved foods: a name and a number for the things you buy over and over, added
  to the list or logged as eaten in a single tap, without the packet in front of
  you
- Monday-to-Sunday week view: per-day bars, pace against budget, headroom
  against the weekly ceiling, last week's total
- Tap any day's bar for that day's total, its entries, and a keypad to add
  calories you forgot to record at the time
- History: every week still on record, in that same week view, stepped through a
  week at a time
- A trend line by day or by week, drawn against the same budget and ceiling, with
  a cursor you drag to read any point off it
- Installable as a PWA — launcher icon, no address bar, works offline
- CSV and JSON export, JSON restore
- Light and dark themes, following the system setting

## Usage

**Log eaten** records calories against today immediately.

Both entry points share one keypad, and it does multiplication and division so
you don't have to do the arithmetic before you start typing. Press × or ÷ and
the sum appears under the figure it makes; the big number is always the kcal
that will be recorded, rounded to a whole one. Operators evaluate strictly left
to right, so `132 ÷ 30 × 35` reads as "132 per 30 g, but the bag is 35 g" and
gives 154. Five digits per number, three operators per sum.

**Add to list** queues an item without logging it. Ticking an item off the list
logs it against the day you ticked it, so the list stays a same-day scratchpad —
anything left on it at midnight is dropped. Nothing is lost by that, because
items only enter the log when ticked. Bought something today to eat tomorrow?
Use **Log eaten** tomorrow rather than the list.

## Saved foods

If you eat the same sandwich most weeks, its number shouldn't have to be
retyped, or remembered while you're standing in the shop holding something else.

**Saving one.** Type the amount and a name on the keypad and tap **Save** beside
the name field. That only saves the food — the entry itself still needs the
button underneath, so you can save something without eating it. Type the same
name again with a different number and the button reads **Update**: packaging
gets reformulated, and two rows claiming to be the same sandwich are worse than
one that's current. Foods can also be typed straight in from **Foods → Add a
food**, or **Settings → Manage foods**, for filling the list in at the kitchen
table rather than in an aisle.

**Using one.** Saved foods sit as chips above the keypad, the six most recently
used first. A chip is a whole entry, so **one tap commits it** — to the list in
**Add to list**, to today in **Log eaten**, to whichever day you opened in the
week view. Tap three chips and three things are on the list; the readout above
keeps score as you go. Anything half-typed is cleared when you tap a chip, so
the big number never claims something that wasn't recorded.

The strip is built when the sheet opens and left in that order until it closes.
Tapping a food makes it the most recently used, but a strip that resorted itself
between taps would move the next chip out from under your thumb.

**Finding the rest.** **Foods**, at the right-hand end of the strip, lists every
saved food A–Z, one tap per row to add, with the room-you-have-left figure and
the way out both pinned to the top of a long list. Rows show *on the list ×2* or
*logged ×1* where they apply, which is the answer to "did I put the sandwich in
the basket or only think about it?". **Edit** on a row changes its name or
number, or deletes it.

Bare amounts you've used recently still appear as chips after the foods, unnamed
and unremembered, for one-offs that aren't worth saving. They behave the same
way: one tap adds them. An amount that matches a saved food isn't listed twice.

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

Eight weeks of daily records are retained. The front page stays on this week and
last week's total; everything else is under **History**. Days older than the
window are dropped as new ones arrive, so export if you want to keep them.

## History

**History & trend**, at the foot of the week panel, opens the record. The top of
the sheet is the same week block the front page shows — the same bars, the same
budget and ceiling lines — with **‹** and **›** to step a week at a time, as far
back as the retention window goes. Bars stay tappable, so a day eight weeks ago
opens exactly as today's does, entries and all, and **Done** comes back to the
week you were looking at rather than dumping you on the front page.

Underneath is the trend, toggled between **Days** and **Weeks**. Both are drawn
against two dashed rules: amber where the daily budget sits, red where the
expenditure ceiling does, each multiplied by seven in the weeks view. A point
above the amber line is an amber day; above the red one the week is in genuine
surplus. That is the whole legend — there are no axis numbers to squint at.

The figure comes from the cursor instead. Drag across the plot and the readout
above it names the day or week under your thumb and what it came to; lift your
thumb and the week block above steps to that week, which makes the line a way of
getting somewhere as well as something to look at. The most recent point is
selected by default, drawn hollow because a day or week still in progress is not
a finished one.

In the days view, a day you logged nothing on breaks the line rather than
dropping to zero — not logging is not the same as not eating, and a floor-scraping
dive would claim otherwise. Weeks are totals, so a week you barely used the app
is simply a low one.

## Data

Everything lives in `localStorage` under the key `calcount:v1`, scoped to the
origin serving the app — settings, day records, today's list, and your saved
foods. Nothing is transmitted anywhere.

It survives closing the app, rebooting, and deploying updates. It does not
survive clearing browsing data, uninstalling with the "remove data" option, or
switching browser or phone.

**Export from Settings periodically.** CSV gives one row per entry
(`date, time, kcal, label, source`) for use in a spreadsheet; backfilled entries
have an empty `time`. JSON is a full backup — day records, settings and saved
foods — that **Restore** reads back in, and is the route onto a new phone.

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
