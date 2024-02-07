import { defaultTheme, Provider } from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";

import { Canvas } from "@.tldraw.canvas";

import "./App.css";
import { UnsupportedBrowser } from "../../@.core/_impl_/UnsupportedBrowser";
import { appStore } from "../../@.core/_impl_/AppModel";
import { observer } from "mobx-react";
import { OpenCodeplotFile } from "../../@.core/_impl_/OpenCodeplotFile";

const App = observer(() => {
  return (
    <Provider
      UNSAFE_style={{
        width: "100%",
        height: "100%",
      }}
      theme={defaultTheme}
    >
      {!appStore.isBrowserSupported && <UnsupportedBrowser />}
      {!appStore.isFileOpened && <OpenCodeplotFile />}
      {appStore.isFileOpened && <Canvas />}
      <ToastContainer />
    </Provider>
  );
});

export default App;
