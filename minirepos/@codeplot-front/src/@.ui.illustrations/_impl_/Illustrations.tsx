/// <reference types="vite-plugin-svgr/client" />
import { Suspense, lazy } from "react";
import "./styles.css";

type Illustrations = "Upload" | "NotFound";

export function Illustration({ name }: { name: Illustrations }) {
  const DynamicComp = lazy(() => import(`./${name}.svg?react`));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComp className="codeplot-Illustration" />
    </Suspense>
  );
}
