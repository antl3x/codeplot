import { useToast } from "@react-aria/toast";
import type { QueuedToast, ToastState } from "@react-stately/toast";
import { useRef } from "react";
import { IToast } from "./toastQueue";
import { Icon } from "@.ui.Icons";

interface ToastProps {
  toast: QueuedToast<IToast>;
  state: ToastState<IToast>;
}

export function Toast(props: ToastProps) {
  const ref = useRef(null);

  const { toastProps, titleProps, descriptionProps, closeButtonProps } =
    useToast(props, props.state, ref);

  return (
    <div {...toastProps} ref={ref} className="codeplot-Toast">
      Icon
      <div className="codeplot-Toast_Title" {...titleProps}>
        {props.toast.content.title}
      </div>
      <div
        className="codeplot-Toast_Description codeplot-typography-body"
        {...descriptionProps}
      >
        {props.toast.content.description}
      </div>
      <div className="codeplot-Toast_CloseBtn" {...closeButtonProps}>
        <Icon name="Close" className="codeplot-Toast_Icon" />
      </div>
    </div>
  );
}
