# Editorial recovery: 2026-09-13

This is an incremental recovery, not an AdSense approval certificate.

## Implemented

- Replaced 75 article bodies, preserving published URLs and original publication dates. Each replacement has its own source links and distinguishes proposed itineraries from measured or first-hand experiences.
- Added English and Japanese About, region and category pages; repaired navigation and canonical category aliases.
- Added a genuine noindex 404 document and excluded it from sitemaps.
- Removed the automatic accommodation recommendation panel, including expired check-in dates and cross-city recommendations.
- Withheld uncertain generated-path body/hero images. Files remain available for later rights and location verification. A generated directory name alone does not prove an image was AI-generated.
- Disabled scheduled publication while editorial work remains. Manual publication is still possible.
- Replaced word/image quotas with separate technical and editorial checks. Technical CI does not imply AdSense eligibility.

## Verification

- Fresh-cache Astro build: 382 generated routes; HTML audit includes 384 files (including verification files), 295 travel articles.
- Content integrity and asset-existence checks pass.
- Built HTML check: zero technical errors across canonicals, internal destinations, anchors, expired stay-panel dates and authoring-purpose text.
- 220 of 295 articles remain in the individual editorial queue. The 75 rewritten articles are not exempt from future factual corrections or image-rights checks.
- Five long repeated passages still occur across at least three article bodies, down from 90 in the original audit. This is an internal exact-match diagnostic, not a Google score.
- 90 articles lack external source links under the automated classifier. A link count alone cannot establish source quality or factual accuracy.
- Jeonju food-budget examples are explicitly hypothetical. Current branch-specific restaurant prices remain unverified.
- Chuncheon includes explicitly attributed municipal-portal menu prices, not a claim of current prices checked at the restaurant. Seomun Night Market's operator-posted weekday closures and weekend hours replace an undifferentiated market schedule.
- First release 8716007 was verified against all 295 live article bodies and their canonicals. Production 404 and the initial localized route probes passed. Subsequent releases require a new production-report.json.
- Browser inspection passed at the actual available 673px viewport. Requested 390px/1440px viewport overrides were not honored by the browser tool; those breakpoint screenshots remain unverified and must not be represented as passed.

## Important migration safeguard

The initial bulk deletion left sparse checklists and planning tables in unrevised articles. Those paragraph deletions were reversed before release. Only individually rewritten articles replace those sections. Unreviewed repetition is deliberately still reported rather than hidden by deleting useful surrounding structure.

The migration script reads commit 731913e, so do not rerun it after making unrelated article changes. Add subsequent reviewed bodies to the replacement directory, apply those replacements and repair links without rerunning the baseline migration.

## Remaining work

1. Review the five remaining repeated passages and their affected articles, starting with the Busan Station half-day guide that already receives search visits. Do not replace duplication merely with synonymous filler.
2. Verify branch-specific current menu evidence where useful. The five Korean regional food guides have been rewritten, but absence of a verified price is disclosed rather than filled with a fictitious regional average.
3. Work through editorial-pending.json, prioritizing existing Search Console traffic and overlap in search intent. Merge only where there is a justified equivalent destination and an explicit redirect plan.
4. Check retained photographs against location and license records. Do not substitute fabricated fieldwork.
5. Check production HTTP status codes and deployed article bodies after each release. Local build success alone is insufficient.
6. Complete the editorial queue before considering another AdSense review. No review request has been submitted by this recovery.

Policy reference: https://support.google.com/adsense/answer/10015918
