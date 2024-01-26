export default {
    computedFields: [
      (fileInfo, ast) => {
        // Your custom logic here
      },
    ],
    include: ["docs/**/*.mdx"], // Include only files matching this pattern
    exclude: ["drafts/**/*.md"], // Exclude those files matching this pattern
  };