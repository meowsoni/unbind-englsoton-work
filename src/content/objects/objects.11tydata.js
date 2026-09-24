const toArray = (value) =>
  value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];

const KIND_LABELS = {
  book: "Book under review",
  article: "Article",
  artwork: "Artwork",
  poem: "Poem",
  archive: "Archive",
};

export default {
  tags: ["objects"],
  permalink: false,
  eleventyComputed: {
    slug: (data) => data.page.fileSlug,
    kindLabel: (data) => KIND_LABELS[data.kind] || "Work",
    targetProjects: (data) => toArray(data["target-project"]),
  },
};
