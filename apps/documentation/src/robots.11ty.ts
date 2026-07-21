import type { SiteData } from "./_data/site";

interface RobotsData {
  site: SiteData;
}

export default class Robots {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalink: "/robots.txt",
    };
  }

  render(data: RobotsData): string {
    // Storybook (public component docs) is crawlable, but its preview
    // canvas is an unstyled, context-free fragment — keep it out of the
    // index.
    return `User-agent: *
Allow: /
Disallow: /storybook/iframe.html

Sitemap: ${data.site.url}/sitemap.xml
`;
  }
}
