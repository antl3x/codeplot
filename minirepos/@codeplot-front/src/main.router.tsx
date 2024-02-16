import { OpenOrCreate, appStore } from "@.core";
import { Canvas } from "@.tldraw.canvas";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { observer } from "mobx-react";

import {
  Provider as AdobeSpectrumProvider,
  defaultTheme,
} from "@adobe/react-spectrum";
import { ToastContainer } from "@react-spectrum/toast";
import { reaction } from "mobx";
import { useEffect } from "react";

import "./main.css";

const routeRoot = createRootRoute({
  component: observer(() => {
    useEffect(() => {
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
      <AdobeSpectrumProvider UNSAFE_className="spectrum" theme={defaultTheme}>
        <Outlet />
        <ToastContainer />
      </AdobeSpectrumProvider>
    );
  }),
});

const routeIndex = createRoute({
  getParentRoute: () => routeRoot,
  path: "/",
  component: observer(() => {
    return appStore.fileManager.openedFile ? <Canvas /> : <OpenOrCreate />;
  }),
});

// Redirect Route to Discord Link
const routeDiscord = createRoute({
  getParentRoute: () => routeRoot,
  path: "/discord",
  component: () => {
    window.location.href = "https://discord.gg/fYTsNp5Wvt";
    return null;
  },
});

const routeTree = routeRoot.addChildren([routeIndex, routeDiscord]);

export const router = createRouter({ routeTree });
