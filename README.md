# Northampton Judo Club

Static, responsive website for Northampton Judo Club, ready for GitHub Pages.

## Local preview

Run a static server from the repository root:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

In the repository settings, choose **Pages → Deploy from a branch**, then select `main` and `/ (root)`.

## Content migration

- `data/content.json` contains searchable text extracted from all 98 public source URLs.
- `assets/archive/` contains 420 downloaded source asset records (419 usable files plus one malformed Squarespace video-template URL retained in the migration log outside this repository).
- The homepage includes a curated club gallery using preserved original photography.

The main site curates the most useful content for prospective members while the archive preserves the long-form programmes, policies, history, gallery records and events.
