export const Button = () => {
  return (
    <button
      className={`bg-[rgba(var(--codeplot-color-accent),1)]
      text-[hsla(var(--codeplot-color-accent-foreground),1)]
      drop:active:bg-white
      rounded-md
      border
      border-[hsla(var(--codeplot-color-accent-border),1)]
      w-fit
      font-medium
      text-sm
      px-4
      py-2`}
    >
      Select file
    </button>
  );
};
