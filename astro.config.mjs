import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import versionImageUrls from "./scripts/version-image-urls.mjs";

export default defineConfig({
  site: "https://korplaylist.com",
  output: "static",
  integrations: [sitemap({filter: page => !page.endsWith('/404.html')}), versionImageUrls()],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
