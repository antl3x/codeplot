module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow imports from local modules without a '@' in their name, while allowing package imports",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [], // no options
  },
  create: function (context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Check if the import is from a local module (starting with '.' or '@')
        const isLocalModule =
          importPath.startsWith(".") || importPath.startsWith("@");

        if (isLocalModule) {
          // Split the import path on '/'
          const segments = importPath.split("/");

          // Check that each segment after './' or '@' contains '@'
          const isInvalidImport = segments.some((segment, index) => {
            // Skip the first segment if it's just './' or '@'
            if (index === 0 && (segment === "." || segment === "@")) {
              return false;
            }
            return !segment.includes("@");
          });

          if (isInvalidImport) {
            context.report({
              node,
              message:
                'Invalid import: local module imports must contain a "@" in each segment after the initial "./" or "@".',
            });
          }
        }
      },
    };
  },
};
