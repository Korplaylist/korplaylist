# Production workflow

The active checkout is `C:/Users/Hong/Documents/korplaylist-production`.
Remote: `https://github.com/Korplaylist/korplaylist.git`. Production branch: `main`.

Before publishing, fetch origin and compare the current commit with origin/main.
Do not copy an older checkout's complete src or public directory over this checkout.
Preserve other working folders and their uncommitted work. Apply specific reviewed changes only.

Run the content review, asset check, Astro build and built-site audit before deployment.
After deployment, verify real production URLs, not only HTTP 200: compare h1, language,
canonical, article body, navigation targets, and the status of a nonexistent URL.

Automated checks detect regressions; they do not certify AdSense eligibility.
Use verified sources and retain original publication dates. Update modified dates only
when content actually changes. Do not pad articles to meet a character/image quota.
Do not fabricate visits, photos, prices or field verification. Do not reinstate removed
template paragraphs or irrelevant affiliate recommendations in later batches.
