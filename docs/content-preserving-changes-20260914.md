# Content-preserving maintenance: September 14, 2026

Baseline: `a9097e4`, the restored site. This change does not reapply the abandoned full-article recovery.

## Scope

- Preserve all 295 article files, titles, descriptions, publication dates, URLs, hero references and image captions.
- Preserve article photographs, figures, planning tables, route blocks and summary/checklist content. Four previously broken internal links may change within those blocks.
- Replace only 12 repeated advisory paragraphs across the Busan Station half-day, Busan rainy-day and Haeundae/Gwangalli evening guides. Keep their existing routes, tables, FAQs, section order and photos.
- In six other articles, change editorial-purpose headings or wording into reader-facing travel guidance without removing their sections.
- Correct four internal links in the Daejeon/Suwon guides.
- Add English/Japanese About pages, correct shared navigation, implement a real 404, combine Korean category aliases without changing article metadata or URLs, and update sitemap entries.
- Preserve hotel-card photographs. Remove expired booking dates from outbound URLs and replace unverified price/rating displays with links to current details. Where only another city's listings exist, label that city explicitly and offer a search for the actual destination.
- Add advertising privacy disclosures and settings links. Do not insert ad code or claim an AdSense account is connected.
- Revalidate HTML documents while retaining long image caching. Existing CDN rule overrides and cache invalidation still require production verification.

## Checks

`node scripts/check-content-preservation.mjs` compares article source against the baseline. It fails on removed articles, unexpected metadata/image/table/route changes or large body reductions. It does not prove factual accuracy or AdSense eligibility.

`node scripts/check-site-preserving-content.mjs` checks the completed build for article count, internal destinations, fragments, canonicals, stale booking URLs, authoring-purpose text and noindex 404/sitemap behavior. Repeated paragraphs remain a diagnostic, not a pass/fail quota.

The remaining repeated paragraph types have not been rewritten in this batch. No mass deletion, broad noindex change, new travel articles, image replacement or approval request is included.

## External settings still pending

- Confirm the site's verification method in AdSense before changing advertising CSP permissions or adding ad scripts. ads.txt verification is a valid option; script absence alone is not a confirmed connection failure.
- Confirm regional consent settings before serving ads to applicable audiences.
- The optional www hostname requires DNS/hosting access. No DNS or account security setting is changed here.
- Check current Search Console reports and real-user performance separately; no live account access was available during the audit.
