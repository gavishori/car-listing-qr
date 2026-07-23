# car-listing-qr

A standalone QR code for one Yad2 car listing. **Completely separate from any
other project** — its own GitHub repo, its own dedicated Firebase project, no
shared code or data with anything else.

## What it does

1. **`public/qr/index.html`** — the page the QR code points to. On load it
   writes one anonymous record to Firestore, then immediately redirects the
   visitor to the real listing:
   `https://www.yad2.co.il/vehicles/item/57q4474l`
2. **`public/qr/dashboard.html`** — a private page (only you should open it)
   showing the running scan count, a breakdown by rough device type, and a
   list of recent scans.
3. **`public/qr/generate-qr.html`** — renders the actual QR image for the
   hosted redirect URL and lets you download it as a PNG to print/share.

The dashboard also has an **"איפוס המונה" (reset)** button at the bottom
that permanently deletes all recorded scans after a confirmation prompt —
use it to zero the counter out (e.g. before actually posting the listing).

## What data is collected (and what isn't)

Every scan writes exactly one Firestore document with three fields:

| field     | example    | notes                                   |
|-----------|------------|------------------------------------------|
| `ts`      | server time | set by Firestore itself, not the client |
| `device`  | `נייד` / `טאבלט` / `מחשב` | coarse guess from the browser's user-agent |
| `browser` | `Chrome` / `Safari` / ... | coarse guess from the user-agent |

**Never collected, and not possible to collect this way:** name, phone
number, email, exact location, or IP address. There is no form, no login, and
no way to tie a record back to a specific person.

## One-time setup (you need to do this — I can't log into your Google
account for you)

### 1. Create a fresh Firebase project

Go to <https://console.firebase.google.com> → **Add project** → any name
(e.g. "car-qr-counter"). You do **not** need Analytics for this.

Inside the new project: **Build → Firestore Database → Create database**
(Native mode, any region close to you).

Still inside the project: **Project settings → General → Your apps → Add app
→ Web (`</>`)**. Give it any nickname. Firebase will show you a config object
that looks like:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 2. Paste the config into this project

Open [`public/qr/firebase-config.js`](public/qr/firebase-config.js) and
replace the six `REPLACE_ME` placeholders with those real values.

Then open [`.firebaserc`](.firebaserc) and replace
`REPLACE_WITH_NEW_PROJECT_ID` with the project's actual ID (shown at the top
of Project settings).

### 3. Log in and deploy

From this folder, run once:

```
npx firebase-tools login
```

That opens a browser window for a one-time Google login. After that,
deploying (both the pages and the Firestore security rules) is one command:

```
npx firebase-tools deploy
```

It will print a **Hosting URL** like `https://car-qr-counter.web.app`. Your
three pages live at:

- Redirect (this is what the QR should encode): `https://<your-project>.web.app/qr/`
- Dashboard (keep this link to yourself): `https://<your-project>.web.app/qr/dashboard.html`
- QR generator: `https://<your-project>.web.app/qr/generate-qr.html`

### 4. Generate the actual QR image

Open the **QR generator** URL above (or `public/qr/generate-qr.html` locally),
confirm the URL field shows your real redirect page, and click **הורדה
כ-PNG** to download the printable QR code.

## Notes on privacy of the dashboard

The dashboard isn't password-protected — anyone with the exact URL could open
it. Since it only ever shows anonymous counts (no names, no PII), that's a
reasonable trade-off for a personal tool, but don't post the dashboard link
publicly.

## Redeploying after a change

Any time you edit a file under `public/qr/`, just run `npx firebase-tools
deploy` again from this folder.
