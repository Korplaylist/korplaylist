# Content-preserving navigation improvements

Baseline: `13dd0ba`. Backup branch: `codex/backup-before-navigation-20260914`.

## Changes

- Add 47 nonempty English/Japanese region/theme index and archive pages. Menus and home-page category links lead to lists, not a single arbitrary article.
- Normalize category aliases in the browsing layer only. Article metadata remains untouched. Archives use stable ASCII paths and are included in the sitemap.
- Add search, region/theme filters, 12-item pagination, counts, empty results, and reset controls to the three all-guide pages and the new archives.
- Break equal-publication-date sort ties by the existing article URL so page membership is consistent across local and production builds.
- Keep all guide links and existing photos in server-rendered HTML. Without JavaScript, every card remains visible. Filter and page state uses URL parameters and survives returning from an article or reloading. The canonical remains the unfiltered archive.
- Connect article language controls to existing translations; when unavailable, use the destination-language all-guide list. The current language stays on the article. Common support/index pages retain their section when switching languages. 404 language controls return home.
- Link translated article breadcrumbs to their region archives and structured author records to the real About pages.

## Preservation

No changes to article files, titles, body text, publication dates, article URLs, image files, or hotel data/cards. All 295 articles and 949 body images remain. The original workspace and unrelated backup directories are untouched.

## Verification

- `node scripts/check-navigation-structure.mjs`: all 295 articles, 47 archives and 336 cross-language article links; no-JavaScript card availability; exact source/photo preservation against the baseline.
- `node scripts/check-site-preserving-content.mjs`: all generated internal links, canonicals, fragments and preserved article/image counts.
- Existing content integrity and asset existence checks.
- Browser checks: desktop and 390px mobile layouts; English search/empty/reset/combined filters; next page and reload; return from an article; Japanese region/theme navigation and Japanese search. No horizontal overflow at the tested mobile width. Existing photos load.
- Public release checks: `node scripts/check-navigation-structure.mjs --production` and `node scripts/check-content-preserving-production.mjs`.

## Remaining items

Unverified hotel listings have not been invented or substituted. Other-city reference cards remain explicitly labeled and preserve their photos. Replacing these with verified destination-specific inventory still requires source data.

No DNS, AdSense verification/consent setting, CSP permission, or Search Console setting changed. These require the relevant account access and configuration decisions. This release does not guarantee AdSense approval and does not submit a review request.
