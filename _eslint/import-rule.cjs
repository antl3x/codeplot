module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow imports from local modules without a '@' in their name, while allowing package imports and exceptions for JSON or CSS files",
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
          importPath.startsWith(".") || importPath.startsWith("@.");

        // Check for allowed file extensions
        const isAllowedExtension = importPath.startsWith("./") || /\.(json|css|scss|svg)$/.test(importPath) || !importPath.includes("_impl_");

        if (isLocalModule && !isAllowedExtension) {
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
                'Invalid import: local module imports must contain a "@" in each segment after the initial "./" or "@", except for allowed JSON or CSS files.',
            });
          }
        }
      },
    };
  },
};
