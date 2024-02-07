import { ToastQueue } from "@react-stately/toast";

export interface IToast {
  title?: string;
  description: string;
}
export const toastQueue = new ToastQueue<IToast>({
  maxVisibleToasts: 5,
});
