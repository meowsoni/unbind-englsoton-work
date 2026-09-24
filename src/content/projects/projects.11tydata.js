export default {
  layout: "layouts/project.njk",
  tags: ["projects"],
  permalink: "/projects/{{ page.fileSlug }}/",
  eleventyComputed: {
    slug: (data) => data.page.fileSlug,
    pageTitle: (data) => data.name,
    accent: (data) => data.accent || "mint",
  },
};
