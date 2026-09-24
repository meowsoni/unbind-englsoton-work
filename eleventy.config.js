import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addWatchTarget("src/assets");

  // Markdown

  const md = markdownIt({ html: true, linkify: true, typographer: true }).use(
    markdownItFootnote
  );

  md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const n = slf.rules
      .footnote_caption(tokens, idx, options, env, slf)
      .replace(/[[\]]/g, "");
    const sub = tokens[idx].meta.subId > 0 ? `:${tokens[idx].meta.subId}` : "";
    return `<a href="#fn${id}" id="fnref${id}${sub}" class="coin" role="doc-noteref" data-note="fn${id}" aria-label="Note ${n}">${n}</a>`;
  };

  md.renderer.rules.footnote_block_open = () =>
    '<section class="notes" role="doc-endnotes">\n' +
    '<h2 class="notes-title">Notes</h2>\n' +
    '<ol class="notes-list">\n';
  md.renderer.rules.footnote_block_close = () => "</ol>\n</section>\n";

  eleventyConfig.setLibrary("md", md);

  // Filters

  eleventyConfig.addFilter("readableDate", (value) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value))
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  const matches = (item, key, value) => {
    const found = key === "slug" ? item.data.slug ?? item.fileSlug : item.data[key];
    return Array.isArray(found) ? found.includes(value) : found === value;
  };

  eleventyConfig.addFilter("findBy", (items = [], key, value) =>
    items.find((item) => matches(item, key, value))
  );

  eleventyConfig.addFilter("filterBy", (items = [], key, value) =>
    items.filter((item) => matches(item, key, value))
  );

  eleventyConfig.addFilter("limit", (items = [], n) => items.slice(0, n));

  eleventyConfig.addFilter("byOrder", (items = []) =>
    [...items].sort(
      (a, b) =>
        (a.data.order ?? 999) - (b.data.order ?? 999) ||
        String(a.data.name).localeCompare(String(b.data.name))
    )
  );

  // Collections

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("posts").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
