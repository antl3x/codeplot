import { observer } from "mobx-react";

import { appStore, OpenCodeplotFile, UnsupportedBrowser, WebRTC } from "@.core";
import { Canvas } from "@.tldraw.canvas";

import { defaultTheme, Provider } from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";
import { useEffect } from "react";
import "./main.css";
import { reaction } from "mobx";
export const App = observer(() => {
  useEffect(() => {
    // add data-theme-color and data-theme attributes to the root element
    const root = document.documentElement;
    const themeColor = appStore.theme.color;
    const themeName = appStore.theme.name;
    root.setAttribute("data-theme-color", themeColor);
    root.setAttribute("data-theme", themeName);

    return reaction(
      () => appStore.theme.color,
      (color) => {
        root.setAttribute("data-theme-color", color);
      },
    );
  }, []);

  return (
    <Provider UNSAFE_className="spectrum" theme={defaultTheme}>
      {/* <WebRTC /> */}
      <Canvas
        snapshot={JSON.parse(appStore.sharedRootStore.file?.tldrawFile)}
      />
      <ToastContainer />
    </Provider>
  );
});
