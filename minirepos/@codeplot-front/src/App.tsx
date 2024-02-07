import { observer } from "mobx-react";

import { appStore, OpenCodeplotFile, UnsupportedBrowser } from "@.core";
import { Canvas } from "@.tldraw.canvas";

import { defaultTheme, Provider } from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";
import { useEffect } from "react";
import "./main.css";

export const App = observer(() => {
  useEffect(() => {
    // add data-theme-color and data-theme attributes to the root element
    const root = document.documentElement;
    const themeColor = appStore.theme.color;
    const themeName = appStore.theme.name;
    root.setAttribute("data-theme-color", themeColor);
    root.setAttribute("data-theme", themeName);
  }, []);

  return (
    <Provider UNSAFE_className="spectrum" theme={defaultTheme}>
      {!appStore.isBrowserSupported && <UnsupportedBrowser />}
      {!appStore.isFileOpened && appStore.isBrowserSupported && (
        <OpenCodeplotFile />
      )}
      {appStore.fileManager.initialFileContent && (
        <Canvas snapshot={appStore.fileManager.initialFileContent} />
      )}
      <ToastContainer />
    </Provider>
  );
});
