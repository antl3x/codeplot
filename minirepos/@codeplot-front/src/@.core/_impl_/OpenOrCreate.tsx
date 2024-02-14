import CodeplotLogo from "@.assets/dark-lettermark.svg";

import { Illustration } from "@.ui.illustrations";

import { ExternalLink } from "@.ui.ExternalLink";
import { appStore } from "./AppModel";
import { HowItWorksDialog } from "./HowItWorksDialog";

export function OpenOrCreate() {
  const { onChange } = appStore.fileManager.useOpenSnapshotFile();
  const { onClick: createNewFile } = appStore.fileManager.useCreateNewFile();

  // Function to trigger file input click
  const handleClick = () => {
    document.getElementById("hiddenFileInput")?.click();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="py-4 px-4 flex justify-between">
        <img
          src={CodeplotLogo}
          alt="Codeplot Logo"
          className="w-auto opacity-85 h-[32px]"
        />
        <div className="flex gap-6">
          <HowItWorksDialog />
          <ExternalLink href="https://docs.codeplot.co/">Docs</ExternalLink>
          <ExternalLink href="https://github.com/codeplot-co/codeplot">
            Github
          </ExternalLink>
        </div>
      </div>

      <div className="flex items-center justify-center  h-full w-full gap-4 p-4">
        <div
          onClick={handleClick}
          className="flex opacity-75 hover:opacity-100 flex-col border border-[var(--codeplot-surface2-backgroundColor)] bg-[var(--codeplot-surface2-backgroundColor)] text-center p-3 w-1/2 max-w-[320px] h-1/4 items-center justify-center"
        >
          <input
            id="hiddenFileInput"
            type="file"
            onChange={onChange}
            className="hidden"
          />
          <div className="flex  items-center justify-center w-[48px] h-[48px]">
            <Illustration name="Upload" />
          </div>
          <span className="mt-4">Load Snapshot File</span>
        </div>
        <div
          onClick={createNewFile}
          className="flex hover:bg-[var(--codeplot-surface2-backgroundColor)] opacity-75 hover:opacity-100 flex-col max-w-[320px] border border-[var(--codeplot-surface2-backgroundColor)] p-3 text-center border-dashed w-1/2 h-1/4 items-center justify-center"
        >
          <div className="flex items-center justify-center  w-[48px] h-[48px]">
            <Illustration name="CreateNew" />
          </div>
          <span className="mt-4">New File</span>
        </div>
      </div>
    </div>
  );
}
