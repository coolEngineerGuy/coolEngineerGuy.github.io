# Calorie Count

A daily and weekly calorie budget, built to be driven one-handed in a supermarket
aisle. Static files only — no build step, no backend, no accounts. All data lives
in your phone's browser storage.

```
index.html        the whole app
manifest.json     makes it installable
sw.js             offline cache
icons/            launcher icons
.nojekyll         stops GitHub Pages trying to process this as a Jekyll site
```

---

## Deploying to GitHub Pages

1. Make a new repo. It can be private — Pages works on private repos for
   personal accounts on paid plans, and public ones on free; if you're on free,
   make it public. There's nothing sensitive in these files.
2. Upload the contents of this folder to the repo root (drag them into the
   GitHub web uploader if you like — no git required).
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`. Save.
4. Wait a minute or two, then open `https://<you>.github.io/<repo>/` on your phone.

All paths in the app are relative, so it works from a subpath like
`/calorie-count/` without any configuration. If you'd rather have it at
`https://<you>.github.io/` with no subpath, name the repo `<you>.github.io`.

### Installing it

Open the URL in Chrome on Android. Either use the **Install to home screen**
button in Settings inside the app, or Chrome's ⋮ menu → *Add to Home screen*.
You'll get a real launcher icon and no address bar.

Installing also usually gets you persistent storage, which means Chrome won't
evict your data when the phone is short on space. The Settings panel tells you
which mode you're in.

### Making changes later

Edit `index.html` in GitHub's web editor (works fine from a phone), commit, and
Pages redeploys in about a minute.

**Bump `VERSION` in `sw.js` when you do.** The service worker serves the cached
copy first, so without a version bump you may sit on the old one for a launch or
two. Changing `v1` to `v2` throws the old cache away.

---

## The alternatives, if the git round-trip annoys you

- **Netlify Drop** (`app.netlify.com/drop`) — drag this folder onto the page,
  get an HTTPS URL. No account needed to start.
- **Cloudflare Pages** — same idea, direct upload option.

All three are free and behave identically for a static PWA. GitHub Pages' one
real advantage is that you can edit a file from your phone and have it redeploy.

---

## Your data

Stored in `localStorage` under the key `calcount:v1`, on that exact origin.

Things that destroy it: clearing browsing data, uninstalling the PWA and
choosing to remove data, or a different browser/phone. Things that don't:
closing the app, rebooting, deploying an update.

**Export from Settings periodically.** CSV gives you one row per entry
(`date, time, kcal, label, source`) which pivots straight into a spreadsheet.
JSON is a full backup that **Restore** will read back in — that's your route
onto a new phone.

The app keeps eight weeks of daily records but only ever displays this week and
last, per the original brief. The extra weeks exist so the CSV export is worth
something.

## Notes on behaviour

- Weeks run Monday to Sunday.
- The list is a same-day scratchpad. Anything left on it at midnight is dropped.
  Nothing is lost by this: items only enter your log when you tick them, and
  ticking logs them against the day you ticked.
- Bought something today, eating it tomorrow? Use **Log eaten** tomorrow rather
  than the list.
- No web fonts, no CDNs, no network calls of any kind after the first load.
