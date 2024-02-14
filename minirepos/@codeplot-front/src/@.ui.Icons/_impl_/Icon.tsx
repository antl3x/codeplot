/// <reference types="vite-plugin-svgr/client" />
import { Suspense, lazy } from "react";
import "./styles.css";

type Icons = "Close" | "Drag" | "PinOn" | "PinOff";

// Suport to append className

export function Icon({ name, className }: { name: Icons; className?: string }) {
  const DynamicComp = lazy(() => import(`./${name}.svg?react`));

  return (
    <Suspense fallback={<div></div>}>
      <DynamicComp className={`codeplot-Icon ${className}`} />
    </Suspense>
  );
}
