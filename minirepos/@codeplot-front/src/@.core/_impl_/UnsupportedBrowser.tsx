import { ExternalLink } from "@.ui.ExternalLink";
import { Illustration } from "@.ui.illustrations";

export const UnsupportedBrowser = () => {
  return (
    <div className="flex h-full w-full p-12 items-center justify-center flex-col mx-auto">
      <Illustration name="NotFound" />
      <h3 className="mt-4">Unsupported Browser</h3>
      <section className="mt-8 mb-4 max-w-[1024px] text-center">
        It appears that your current browser lacks support for the File System
        Access Web API, which is essential for utilizing codeplot. For an
        optimal experience, we suggest upgrading to the most recent versions of
        Chrome or Edge.
      </section>
      <ExternalLink href="https://github.com/codeplot-co/codeplot/issues/1">
        Github Issue / Feedback
      </ExternalLink>
    </div>
  );
};
