# car-listing-qr

A standalone QR code for one Yad2 car listing. **Completely separate from any
other project** — its own GitHub repo (`gavishori/car-listing-qr`), its own
dedicated Firebase project (`car-qr-counter`), no shared code or data with
anything else.

## What it does

1. **`docs/go/index.html`** — the page the QR code points to. On load it
   writes one anonymous record to Firestore, then immediately redirects the
   visitor to the real listing:
   `https://www.yad2.co.il/vehicles/item/57q4474l?key=97eO8nxkFJmbtCZA`
2. **`docs/index.html`** — the site's home page: a dashboard showing the
   running scan count, a breakdown by rough device type, and a list of
   recent scans. This is what opens when you click **"Visit site"** on
   GitHub Pages, or the bare hosting URL on Firebase.
3. **`docs/generate-qr.html`** — renders the actual QR image for the `/go/`
   redirect URL and lets you download it as a PNG to print/share.

The dashboard also has an **"איפוס המונה" (reset)** button at the bottom
that permanently deletes all recorded scans after a confirmation prompt —
use it to zero the counter out (e.g. after testing, right before actually
sharing the QR for real).

## What data is collected (and what isn't)

Every scan writes exactly one Firestore document with three fields:

| field     | example    | notes                                   |
|-----------|------------|------------------------------------------|
| `ts`      | server time | set by Firestore itself, not the client |
| `device`  | `נייד` / `טאבלט` / `מחשב` | coarse guess from the browser's user-agent |
| `browser` | `Chrome` / `Safari` / ... | coarse guess from the user-agent |

**Never collected, and not possible to collect this way:** name, phone
number, email, exact location, or IP address. There is no form, no login, and
no way to tie a record back to a specific person. The person scanning is
never shown any of this — they just land on the Yad2 listing.

## Hosting: two mirrors of the same site

Both serve the exact same files (`docs/`) and read/write the same Firestore
project, so it doesn't matter which one you use day to day.

- **Firebase Hosting** (already deployed): <https://car-qr-counter.web.app>
- **GitHub Pages**: <https://gavishori.github.io/car-listing-qr/> — needs one
  manual setting: repo **Settings → Pages → Build and deployment → Source
  → Branch: `main`, Folder: `/docs`** (GitHub Pages can only serve from repo
  root or a folder literally named `docs`, which is why the site lives in a
  folder called `docs/`).

Either way, the two URLs you actually use are:

- **QR target** (this is what the QR image encodes): `.../go/`
- **Dashboard** (open this yourself to see the count): the bare root URL

## Generating the QR image

Open `.../generate-qr.html` on whichever host you're using, confirm the URL
field shows the `/go/` address, and click **הורדה כ-PNG**.

## Redeploying after a change

- Firebase: `npx firebase-tools deploy` from this folder (requires
  `npx firebase-tools login` once).
- GitHub Pages: just `git push` — it redeploys automatically from `/docs`.

## Notes on privacy of the dashboard

The dashboard (and its reset button) sit at the site's root, and the repo is
public (required for free GitHub Pages), so anyone who finds the URL can open
it and reset the counter. Since it only ever shows anonymous counts (no
names, no PII), that's a reasonable trade-off for a personal tool — but don't
be surprised if the number moves on its own, and don't treat the count as
tamper-proof.
