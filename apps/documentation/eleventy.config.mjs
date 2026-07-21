import { pathToFileURL } from "node:url";

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("ts", {
    read: false,
    parser: async (filePath) => {
      const mod = await import(pathToFileURL(filePath).href);
      return mod.default;
    },
  });

  eleventyConfig.addExtension("11ty.ts", { key: "11ty.js" });

  eleventyConfig.addPassthroughCopy({
    "node_modules/@measured/set-core/dist/core.css": "assets/set-core.css",
    "node_modules/@measured/set-core/dist/index.js": "assets/set-core.js",
    "node_modules/@measured/set-assets/src/favicons": "assets/favicons",
    "node_modules/@measured/set-assets/src/fonts": "assets/fonts",
    "node_modules/@measured/set-assets/src/fonts.css": "assets/fonts.css",
    "../storybook/storybook-static": "storybook",
    "src/images": "images",
    "src/styles": "assets/styles",
    "src/_headers": "_headers",
  });

  return {
    dir: {
      includes: "_includes",
      input: "src",
      output: "dist",
    },
    htmlTemplateEngine: false,
    templateFormats: ["11ty.ts"],
  };
}
