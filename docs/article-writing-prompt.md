# Article Writing Prompt

## Scope and Priority

Use this prompt with `.automation/manual-editorial-policy.json` for every future Korean, English or Japanese article. It supersedes conflicting historical queue prompts, fixed-length requirements and universal article templates. Do not change existing articles, metadata, URLs, dates or images. Do not run historical bulk rebuild or image-fix scripts. Keep recurring writing automation paused.

Write for a traveler trying to make a concrete decision, not for a keyword quota. Search ranking and AdSense approval cannot be guaranteed. Publishing windows are operational preferences, not ranking claims.

## 1. Research and Brief

- Identify the locale, intended reader, primary query and specific question to answer. Select queries independently for each locale; modifier examples are hypotheses, not proven demand.
- Compare existing same-language articles by intent, not only exact keyword. Record their URLs, overlap and the genuinely new answer. If an existing article already answers the question, select another topic or recommend an update separately; do not edit it without permission.
- Record demand evidence from available Search Console query/page data or actual search-result observations, with dates and limitations. Without data, label demand as a hypothesis. Never invent search volume, difficulty or ranking potential.
- Define the article's added value: a grounded comparison, route with assumptions, reservation decision or practical explanation. Rephrasing other pages is insufficient. Do not copy competitors' structure or paragraphs.
- Research official operator, attraction, transport or government sources for changing facts. Maintain a claim ledger: claim, official URL, checkedAt, applicable date/conditions, and verified/unresolved status. Reading a search snippet alone is not fact verification.
- Hold the article if essential claims cannot be verified. Requested quantity never overrides verification.

## 2. Draft

Put the primary topic or reader question early in a natural title. Avoid inflated promises, unnecessary modifier lists and titles that promise more than the article verifies.

- Answer the primary question in the opening paragraph. Use a clear, accurate title and distinct description that match the actual content. Add a year only when a specific dated event, edition or rule makes it necessary; record why.
- Choose headings for the reader's task. Do not require transport, hotels, weather, budget or FAQ sections in every article. FAQs are optional and must answer unresolved relevant questions, not repeat the body.
- For transport, explain verified boarding, transfers, relevant service restrictions and alternatives. For attractions, explain applicable booking and admission conditions. For itineraries, state route legs, pace and assumptions. For food, distinguish verified menu information from personal opinion; invent no reviews.
- Explain tradeoffs and who each option suits. Separate confirmed facts from editorial estimates and assumptions. Give units, scope and exclusions for costs or durations. Do not reuse universal cost ranges or buffer times without a topic-specific basis.
- Link significant changing claims naturally to the official page. Include an actual check date scoped to the facts checked when useful. Avoid repetitive source-list boilerplate, but never prohibit useful source links. Do not imply the whole article was reverified from one checked fact.
- Never fabricate visits, firsthand experience, credentials, interviews, quotes, prices or author identities. Do not include internal phrases such as SEO enhancement or AdSense information supplementation in public copy.
- Use natural language without keyword density targets or forced exact-match repetition. No minimum word/character count. Remove any paragraph that could be pasted unchanged into an unrelated destination guide without losing meaning.
- Link only genuinely relevant, existing internal pages using descriptive anchor text. Do not invent destinations or force a link quota. Use the reader's language where an appropriate page exists.
- Apply the same accuracy standard to ko/en/ja, with locally natural wording and explanations appropriate to the intended audience. Do not falsely group independently targeted articles as equivalent translations.

## 3. Images

The mandatory rights workflow in `docs/image-sourcing-policy.md` applies before image generation. Verify image-specific permissions and compare outputs with references; unclear rights or unresolved substantial similarity means hold. Multiple-reference blending and AI generation never replace permission.

Plan hero and body image purposes separately. Do not automatically stop at one hero image. If useful body images cannot be responsibly sourced, record and report the limitation rather than padding or silently omitting them. Prefer photorealistic imagery unless the user requests diagrams. Do not depict invented facilities as actual locations.

- Preserve every existing article image. For new articles use relevant, verified assets with documented rights, original source URL, photographer and required credit. Follow `docs/image-sourcing-policy.md` where compatible with this prompt.
- Plan images by informational purpose, not a mandatory hero-plus-three quota. Meet the site's actual schema requirements without adding filler images.
- Describe what is actually visible in alt text. Do not insert an unverified place or keyword merely for SEO.
- Generated illustrative images must not masquerade as documentary photos, proof of a visit or evidence of current conditions. Label them clearly where confusion is possible; a copyright caption alone may not explain this distinction.
- Do not crop, flip, recolor or rename a reused image to evade duplicate checks. Unresolved provenance is a hold condition for the proposed asset, not permission to delete existing photos.

## 4. Review and Handoff

Record the brief, claim ledger, image provenance and review in the new article's planning/audit record, outside public copy. Review each item with pass/hold and a reason:

1. Existing-content boundary preserved; no unapproved edits or replacements.
2. Primary question answered; title and description fulfilled.
3. Same-language overlap checked; distinct value documented.
4. Essential facts verified; natural official links and honest check dates.
5. No invented experience, unsupported certainty or generic padding.
6. Images accurate for their stated purpose and rights documented.
7. Internal links resolve; locale and translation relationships are correct.
8. Content integrity, asset existence, duplicate-image checks and build pass.
9. Mobile and desktop review: table borders, header contrast, cell spacing, overflow, image cropping, legibility and responsive loading checked.
10. After authorized publication, verify the public article URL, images, links and list visibility. A local preview is not a published article.

An automated pass is not editorial verification or Google approval. Length/image-count diagnostics are advisory only. Never set adsenseReady false, noindex, delete, or bulk rewrite existing posts to satisfy these diagnostics. Do not refresh publication dates for apparent freshness. Report unresolved issues and hold affected new drafts instead of publishing them.

## Reference

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
