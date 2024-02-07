import { IllustratedMessage } from "@adobe/react-spectrum";
import { DropZone } from "@react-spectrum/dropzone";
import { ToastQueue } from "@react-spectrum/toast";
import CodeplotLogo from "@.assets/dark-lettermark.svg";

import Upload from "@spectrum-icons/illustrations/Upload";
import { Heading, Text } from "react-aria-components";
import { appStore } from "./AppModel";
import { ExternalLink } from "@.ui.ExternalLink";
import { HowItWorksDialog } from "./HowItWorksDialog";

export function OpenCodeplotFile() {
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
          <ExternalLink href="https://docs.codeplot.com/">Docs</ExternalLink>
          <ExternalLink href="https://docs.codeplot.com/">Github</ExternalLink>
        </div>
      </div>

      <div
        onClick={appStore.fileManager.openFilePicker}
        className="flex w-full h-full items-center justify-center"
      >
        <DropZone
          UNSAFE_className="hover:bg-[--codeplot-surface2-backgroundColor]"
          maxWidth="size-6000"
          onDrop={() =>
            ToastQueue.negative(
              "Drag & Drop is not supported with the File System Access API! Please click to use the file picker.",
            )
          }
        >
          <IllustratedMessage>
            <Upload />
            <Heading level={2}>
              <Text slot="label">Click to open your .codeplot file</Text>
            </Heading>
          </IllustratedMessage>
        </DropZone>
      </div>
    </div>
  );
}
