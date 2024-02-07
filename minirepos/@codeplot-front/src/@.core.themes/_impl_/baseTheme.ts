import { defaultTheme } from "@adobe/react-spectrum";
import { applyPatch } from "fast-json-patch";

const PATCH_OPERATIONS = [
  {
    // Replace the font family with DM Mono
    op: "replace",
    path: "/global/styles/variables/--spectrum-global-font-family-base",
    value: "'DM Mono', sans-serif",
  },
] as const;

// Assuming `baseTheme` is your original theme and `patch` is your JSON Patch array
export const baseTheme = applyPatch(defaultTheme, PATCH_OPERATIONS).newDocument;
