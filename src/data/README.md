# How to add content

Everything on the site comes from **`courses.json`** in this folder. Edit that one
file, commit, push — GitHub Actions rebuilds and deploys automatically.

## Shape

```jsonc
{
  "courses": [
    {
      "code": "CSE220",              // shown big on the card; also the URL: /#/c/cse220
      "name": "Data Structures",     // shown under the code
      "terms": {
        "mid":   { "notes": [ ... ], "solves": [ ... ] },
        "final": { "notes": [ ... ], "solves": [ ... ] }
      }
    }
  ]
}
```

Every entry inside `notes` or `solves` looks like this:

```jsonc
{
  "title":  "Spring 2023",   // required — the row label
  "drive":  "<link or id>",  // required — the Google Drive file
  "credit": "Sabbir"         // optional — small grey line under the title; omit to hide
}
```

- `notes` = class notes, titled however you like ("Linked Lists", "Handwritten notes").
- `solves` = past exam papers, usually titled by term and year ("Fall 2023").
- An empty array is fine — the page shows a "nothing here yet" note instead.

Each entry gets its own page and URL, derived from the title:
`"Spring 2023"` → `/#/c/CSE220/mid/solves/spring-2023`. Renaming an entry changes
its URL, so old links to it stop working. Two entries with the same title in the
same list are fine — the second becomes `spring-2023-2`.

## The `drive` field

Paste whatever Drive gives you. All of these work:

```
https://drive.google.com/file/d/1AbC.../view?usp=sharing
https://drive.google.com/open?id=1AbC...
1AbC...
```

**The file must be shared as "Anyone with the link → Viewer".** If it is restricted,
visitors will see a Google sign-in box inside the embedded viewer instead of the PDF.

To check: open the file in Drive → **Share** → under *General access* choose
**Anyone with the link**, role **Viewer** → Copy link.

### Download and Print

Each file's page has **Download**, **Print** and **Drive** buttons.

Both Download and Print depend on Drive allowing downloads for that file. If you
tick *"Viewers cannot download, print or copy"* in Drive's share settings, those
two buttons will fail for everyone — the file stays readable in the embedded
viewer, but nothing can leave it. Leave that setting **off** for study material.

Print opens the file in a new tab rather than printing in place. That is a browser
security rule, not a bug: a page is not allowed to reach into a frame served by
another domain, so the print dialog has to be raised where the PDF actually lives.

## Adding a whole new course

Copy an existing course object, change `code` and `name`, and replace the entries.
Courses appear on the homepage in the order they are listed here.

## Sanity check before pushing

```sh
node -e "JSON.parse(require('fs').readFileSync('src/data/courses.json'))" && echo OK
```

A trailing comma or a missing quote will break the build — this catches it in a second.
