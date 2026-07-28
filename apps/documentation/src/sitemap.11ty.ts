import type { SiteData } from "./_data/site";

interface CollectionItem {
  url?: string;
}

interface SitemapData {
  collections: { all: CollectionItem[] };
  site: SiteData;
}

// Real, indexable HTML pages only — skip the generated text artifacts and
// the 404. Storybook is crawlable but absent here: it's a client-rendered
// SPA with no static, enumerable routes for this build to list.
const isPageUrl = (url: string | undefined): url is string =>
  Boolean(url) &&
  !url!.endsWith(".txt") &&
  !url!.endsWith(".xml") &&
  !url!.endsWith(".webmanifest") &&
  url !== "/404.html";

export default class Sitemap {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalink: "/sitemap.xml",
    };
  }

  render(data: SitemapData): string {
    const urls = data.collections.all
      .map((item) => item.url)
      .filter(isPageUrl)
      .sort();
    const body = urls
      .map((url) => `  <url><loc>${data.site.url}${url}</loc></url>`)
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  }
}
