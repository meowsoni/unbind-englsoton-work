const toArray = (value) =>
  value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];

export default {
  layout: "layouts/article.njk",
  tags: ["posts"],
  permalink: "/posts/{{ page.fileSlug }}/",
  eleventyComputed: {
    slug: (data) => data.page.fileSlug,
    pageTitle: (data) => data.title,
    postType: (data) => data["post-type"] || "article",
    cover: (data) => data.cover || "/assets/img/covers/blank.jpg",
    authors: (data) => toArray(data.author),
    targetObjects: (data) => toArray(data["target-object"]),
    targetProjects: (data) => toArray(data["target-project"]),
    featured: (data) => data.featured === true,
  },
};
