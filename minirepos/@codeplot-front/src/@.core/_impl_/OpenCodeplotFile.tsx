import { IllustratedMessage } from "@adobe/react-spectrum";
import { DropZone } from "@react-spectrum/dropzone";
import { ToastQueue } from "@react-spectrum/toast";

import Upload from "@spectrum-icons/illustrations/Upload";
import { Heading, Text } from "react-aria-components";
import { appStore } from "./AppModel";

export function OpenCodeplotFile() {
  return (
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
  );
}
