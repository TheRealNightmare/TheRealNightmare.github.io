# Course Archive

A study archive for class notes and past exam solves. Everything is organised as:

```
Course  →  Mid / Final  →  Class Notes + Solves  →  the file
```

PDFs live in Google Drive and are embedded directly in the page, so you read them
here without bouncing out to Drive. Every file gets its own shareable URL, plus
Download, Print and prev/next links. A global search in the header
(<kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>) matches course names *and*
individual file titles, so you can jump straight to "Fall 2023" without clicking
through.

**Live site:** <https://therealnightmare.github.io/>

---

## Adding your notes

**You do not need to install anything.** All the content on the site comes from a
single file, [`src/data/courses.json`](src/data/courses.json), which you can edit
directly on GitHub in your browser.

### 1. Put the PDF on Google Drive and make it public

This is the step people get wrong, and the site cannot work around it.

1. Upload the PDF to your Drive.
2. Right-click it → **Share**.
3. Under *General access*, change **Restricted** to **Anyone with the link**.
4. Leave the role as **Viewer**.
5. Click **Copy link**.

> **Leave "Viewers cannot download, print or copy" switched OFF.** If it is on,
> the Download and Print buttons will fail for everyone, even though the PDF
> still displays. For study material you want it off.

If a file stays *Restricted*, visitors get a Google sign-in box where the PDF
should be.

### 2. Add an entry to `courses.json`

Open [`src/data/courses.json`](src/data/courses.json) on GitHub and click the
pencil icon. Find your course and drop your file into the right list:

```jsonc
{
  "code": "CSE220",              // shown on the card, and in the URL
  "name": "Data Structures",
  "terms": {
    "mid": {
      "notes":  [ /* class notes go here */ ],
      "solves": [ /* past exam papers go here */ ]
    },
    "final": { "notes": [], "solves": [] }
  }
}
```

Each entry looks like this:

```jsonc
{
  "title":  "Spring 2023",   // required — the row label
  "drive":  "<paste your link>",
  "credit": "Sabbir"         // optional — leave it out if you like
}
```

- **`notes`** = class notes. Title them however you want: `"Linked Lists"`,
  `"Handwritten notes"`, `"Chapter 1–4"`.
- **`solves`** = past exam papers, usually titled by term and year:
  `"Fall 2023"`.
- Paste the Drive link in whatever form Drive gives you. All of these work:

  ```
  https://drive.google.com/file/d/1AbC.../view?usp=sharing
  https://drive.google.com/open?id=1AbC...
  1AbC...
  ```

**Adding a whole new course?** Copy an existing course block, change `code` and
`name`, and replace the entries. Courses appear on the homepage in the order
they're listed.

### 3. Open a pull request

Scroll down, write a short description ("add CSE220 Fall 2023 solve"), and choose
**Create a new branch and start a pull request**. Once it's merged the site
rebuilds and deploys itself within a minute or two.

### Before you submit: check your JSON

A stray comma or a missing quote will break the build. If you have Node
installed you can check in one second:

```sh
node -e "JSON.parse(require('fs').readFileSync('src/data/courses.json'))" && echo OK
```

Otherwise paste the file into any online JSON validator. The real `courses.json`
does **not** support `//` comments — those above are only for explanation here.

More detail on the data format lives in
[`src/data/README.md`](src/data/README.md).

---

## Running it locally

Only needed if you want to change the code or design. You'll need
**Node 20.19+ or 22+**.

```sh
git clone https://github.com/TheRealNightmare/TheRealNightmare.github.io.git
cd TheRealNightmare.github.io
npm install

npm run dev      # dev server at http://localhost:5173
npm run build    # production bundle into dist/
npm run preview  # serve the built bundle
```

## Project layout

```
src/
  data/courses.json     ← all site content lives here
  lib/data.js           course lookup, URL slugs, the search index
  lib/drive.js          turns any Drive link into embed/download/print URLs
  routes/               Home · Course · Term · Viewer (one per page)
  components/           cards, rows, search bar, icons
  styles/tokens.css     ← every colour, border, shadow and font
  styles/global.css     layout and component styles
```

## Deploying

Pushing to `main` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the
site and publishes it to GitHub Pages. No manual deploy step.

**One-time setup on a fresh fork:** repo *Settings → Pages → Source* must be set
to **GitHub Actions**.

### Forking this for your own university

1. Fork the repo, then gut `src/data/courses.json` and put your own courses in.
2. Edit the site title in [`index.html`](index.html) and the header wordmark in
   [`src/App.jsx`](src/App.jsx).
3. **If your repo is not named `<username>.github.io`**, the site will be served
   from a subpath and the assets will 404 unless you set the base. In
   [`vite.config.js`](vite.config.js):

   ```js
   export default defineConfig({
     base: '/your-repo-name/',   // was '/'
     plugins: [react()],
   })
   ```

   Routing itself is fine either way — the app uses `HashRouter`, so deep links
   survive a refresh without any redirect hack.

## Notes, quirks and limitations

- **Renaming a file changes its URL.** Page addresses are generated from the
  title (`"Spring 2023"` → `/#/c/CSE220/mid/solves/spring-2023`), so renaming an
  entry breaks old links to it. Two entries with the same title in the same list
  are fine — the second becomes `spring-2023-2`.
- **Print opens the PDF in a new tab** rather than printing in place. That's a
  browser security rule, not a bug: a page can't reach into a frame served by
  another domain, so the print dialog has to be raised where the PDF lives.
- **Download and Print both depend on Drive permissions** — see the warning in
  step 1.
- **Course codes are matched loosely** in URLs, so `/#/c/cse220` and
  `/#/c/CSE220` both work.

## Design

React 19 + Vite, no CSS framework.

The look is **neo-retro on cream**: a pale cream page with a faint dot grid,
lighter cream panels, retro red as the primary and amber as the secondary,
near-black borders with solid offset shadows, and a deep red hero band — the
only dark region on the site. Archivo Black for display type, Space Grotesk for
body.

**To retheme the entire site, edit one file:**
[`src/styles/tokens.css`](src/styles/tokens.css). Every colour, border width,
shadow and font is defined there once. Two text tokens exist by design —
`--text` for anything on a panel, `--on-paper` for anything on the page itself —
so the background can change without hunting through every rule.

There is deliberately no dark mode and no per-course colour.

Motion is kept subtle and always honours `prefers-reduced-motion`: lists stagger
in, cards lift toward the cursor, rows slide, and the search panel fades open.
