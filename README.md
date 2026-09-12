# eliotwalter.dev

Personal site. One page: an animated hero, a list of work, what I'm exploring, and a footer with contact links, resume downloads, a link to this source and a view counter. French and English, toggled in the header.

Built with Vite, React 19, Tailwind CSS 4, [motion](https://motion.dev) and [three](https://threejs.org). Hosted on Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173, with a fake /api/views counter
npm run build
npm run lint
```

## Layout

- `src/content/` holds every string on the page, typed once in `types.ts` and written twice in `fr.ts` and `en.ts`. `locale.tsx` picks the language (saved choice, then browser language) and exposes it to components.
- `src/components/` is one file per section. `Backdrop.tsx` mounts the three.js hero and keeps a poster image up until it is ready.
- `src/scene/` is the hero. `createScene.ts` builds the layers in the artwork's pixel space (backdrop, drifting clouds, branches, a canopy that moves in the wind) and everything on top: the passionflower vine, alpine flower beds (`plants.ts`), a stoneware pot of orange blooms on the wall, a coffee on the desk, a laptop that types Django (`editor.ts`), an Italian greyhound dozing under the stool (`dog.ts`), a flock of birds, steam, falling petals, sparkles on the lake. `mountain.ts` is the Mont Blanc massif: ridges of relief geometry under a shader that lights, hazes and clips them to the painted skyline, so the range sits behind the city instead of over it. Everything else is painted on canvases at startup by `paint.ts` and `plants.ts`, so there are no extra image files. Open `/dev/sprites.html` on the dev server to see every sprite at 4x while editing a painter.
- `api/views.ts` is a Vercel function backed by Upstash Redis. `POST` increments, `GET` reads.
- `public/art/` holds the WebP hero layers. `art-src/` holds the raw PNGs they are cut from.
- `public/resume/` holds the PDF resumes linked from the footer.

## Hero artwork

The layers in `public/art/` are generated, never edited by hand:

```bash
node scripts/prepare-art.mjs
```

The script needs Playwright's Chromium (`npx playwright install chromium-headless-shell`). It keys the sky out of the backdrop to get the branch layer, keys the checkerboard out of the canopy, crops both, and writes WebP.

The current artwork is a placeholder taken from [varunlohade/basic_website](https://github.com/varunlohade/basic_website), which ships no license. Replace `art-src/*.png` with owned artwork before publishing and rerun the script.

## View counter

Create an Upstash Redis database from the Vercel Marketplace and link it to the project. Vercel injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; `.env.example` lists them for `vercel dev`. Without them the function answers 503 and the footer hides the count.
