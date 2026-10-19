# THE COVEN of WICHES

A speculative site for THE COVEN of WICHES, Chef Annabelle Clarke's vegan sandwich restaurant and bar at 14D Market Row, Brixton Village.

Live: https://alexwilder-dev.github.io/coven-of-wiches/

The site does three jobs. It puts the weekly board, with prices, one tap from Google. It gets people to a unit inside a market. And after 5pm on Wednesday to Saturday it leads with the bar.

## Changing the menu each week

Everything the shop changes is in **`src/data/coven.ts`**:

- `THIS_WEEK`: the board dates, specials, the cauldron side, sides, dips and floats. Copy the new board in here each week.
- `STALWARTS`: the Reuben, which stays on every board.
- `BAR`: Wiccan Liquor and the rest of the bar.
- `HOURS` and `PEAK`: opening sessions per day in 24h time. The open-now sign, the 3–5pm break, the lunch/evening switch and the hours timeline are all worked out from these.
- `CONTACT`: address, Instagram, email and map links.

Nothing else needs touching for a menu change.

## Running it

```sh
npm install
npm run dev       # local preview
npm run build     # production build into dist/
```

Add `?at=fri-19:30` (any day, 24h time) to the URL to see the site as it looks at that moment. The hours timeline does the same when you tap or drag along a day.

## Assets

Photos and the logo are the Coven's own. The originals, and the research behind every word on the site, are in `research/` (start with `research/notes.md`). Each one-off asset script reads from there:

- `npm run logo`: lifts the wordmark off their menu board onto a transparent background and makes the favicons from their "C" mark.
- `npm run images`: resizes the photos to WebP.
- `npm run map`: builds the Market Row map geometry from the OpenStreetMap extract (© OpenStreetMap contributors, ODbL).
- `npm run og`: builds `public/og.jpg`, the 1200×630 link-preview image.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. In the repo settings, set Pages → Source to "GitHub Actions".

Built with Vite, React, TypeScript and Framer Motion.

Site by AlexWilder-Dev
