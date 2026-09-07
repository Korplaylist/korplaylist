import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import versionImageUrls from "./scripts/version-image-urls.mjs";

export default defineConfig({
  site: "https://korplaylist.com",
  output: "static",
  integrations: [sitemap(), versionImageUrls()],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
