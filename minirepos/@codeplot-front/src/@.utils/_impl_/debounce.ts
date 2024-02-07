// eslint-disable-next-line
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: number | null = null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timer !== null) clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
