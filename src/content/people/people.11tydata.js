const toArray = (value) =>
  value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];

export default {
  layout: "layouts/person.njk",
  tags: ["people"],
  permalink: "/people/{{ page.fileSlug }}/",
  eleventyComputed: {
    slug: (data) => data.page.fileSlug,
    pageTitle: (data) => data.name,
    associatedProjects: (data) => toArray(data["associated-projects"]),
    alsoContributesTo: (data) => toArray(data["also-contributes-to"]),
    shortBio: (data) => data["short-bio"] || data.bio,
  },
};
