import { PlotModel } from "@.core.plots";
import { types } from "mobx-state-tree";

export const PageModel = types
  .model("Page", {
    id: types.string,
    title: types.string,
    plots: types.map(PlotModel),
  })
  .views((self) => ({
    get plotsAsReactFlowNodes() {
      return Array.from(self.plots.values()).map((plot) => ({
        id: plot.id,
        type: "resizable", //plot.type,
        data: {
          title: plot.title,
          value: plot.value,
          staticMimes: plot.staticMimes,
        },
        position: { x: 0, y: 0 },
      }));
    },
  }));
