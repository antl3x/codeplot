import { AriaToastRegionProps, useToastRegion } from "@react-aria/toast";
import type { ToastState } from "@react-stately/toast";
import { useToastQueue } from "@react-stately/toast";
import { useRef } from "react";
import { createPortal } from "react-dom";
import "./styles.css";

import { Toast } from "./Toast";
import { IToast, toastQueue } from "./toastQueue";

export function GlobalToastRegion() {
  // Subscribe to it.
  const state = useToastQueue(toastQueue);

  // Render toast region.
  return state.visibleToasts.length > 0
    ? createPortal(<ToastRegion state={state} />, document.body)
    : null;
}

interface ToastRegionProps extends AriaToastRegionProps {
  state: ToastState<IToast>;
}

export function ToastRegion({ state, ...props }: ToastRegionProps) {
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div {...regionProps} ref={ref} className="codeplot-ToastRegion">
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
}
