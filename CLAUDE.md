# Calorie Count

## No dependencies

This project is deliberately dependency-free, and should stay that way. Standard
library only:

- **In the app**: no npm packages, no CDN scripts or stylesheets, no frameworks,
  no fonts or icons fetched from a third party. Browser built-ins only — plain
  DOM, `localStorage`, CSS, the service worker API. There is no `package.json`
  and no build step; `index.html` is the whole app and is served as written.
- **In tooling and verification**: don't install anything to check work either.
  Verify logic by pulling the functions out of `index.html` and running them
  under plain `node` with a hand-written stub for whatever DOM it touches. Ask
  first if there's genuinely no dependency-free route.

The point is that the app keeps working with no toolchain to maintain, nothing to
audit or update, and no network calls after first load. Prefer writing the twenty
lines by hand over adding a dependency that does it.
