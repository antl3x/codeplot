import { types } from "mobx-state-tree";

const PlotStaticMimes = types.model("PlotStaticMimes", {
  "text/plain": types.maybe(types.string),
  "image/svg+xml": types.maybe(types.string),
  "image/png": types.maybe(types.string),
  "image/jpeg": types.maybe(types.string),
  "text/html": types.maybe(types.string),
  "application/json": types.maybe(types.string),
  "application/javascript": types.maybe(types.string),
  "application/x-latex": types.maybe(types.string),
  "text/markdown": types.maybe(types.string),
});

export const PlotModel = types.model("Plot", {
  id: types.string,
  title: types.maybe(types.string),
  type: types.string,
  renderer: types.string,
  staticMimes: PlotStaticMimes,
  value: types.frozen(),
});
