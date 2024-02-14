import { useRef } from "react";
import { ICodeplotShape } from "./ICodeplotShape";
import { appStore } from "@.core";
import { observer } from "mobx-react";
import { GLOBAL_IFRAME_SCRIPT, GLOBAL_STYLE } from "./RenderIframeScripts";

export const DATAFRAME_TABLE_STYLE = `
<style>


    :root {
        /* Light theme colors */
        --background-color: #fff;
        --text-color: #333;
        --header-background-color: #f2f2f2;
        --row-hover-background-color: #f5f5f5;
        --zebra-striping-color: #fafafa;
        --border-color: #ddd;
    }

    [data-theme-color='dark'] {
        /* Dark theme colors */
        --background-color: #333;
        --text-color: #f2f2f2;
        --header-background-color: #444;
        --row-hover-background-color: #555;
        --zebra-striping-color: #3d3d3d;
        --border-color: #555;
    }

    small {
        display: block;
        margin: 8px;
    }

    .dataframe {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        background-color: var(--background-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
    }

    .dataframe th, .dataframe td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    .dataframe thead th {
        background-color: var(--header-background-color);
        color: var(--text-color);
    }

    .dataframe tr:hover {
        background-color: var(--row-hover-background-color);
    }

    .dataframe tbody tr:nth-child(odd) {
        background-color: var(--zebra-striping-color);
    }

    .dataframe + p {
        padding-left: 8px;
    }
</style>
`;

export const PLOTLY_FIGURE_STYLE = `
<style>
body, html {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}

.gtitle {
    font-size: calc(16px + (24 - 16) * ((100vw - 400px) / (800 - 400))) !important;  
}

.xtitle {
    font-size: calc(12px + (24 - 12) * ((100vw - 400px) / (800 - 400))) !important;
}

.ytitle {
    font-size: calc(12px + (24 - 12) * ((100vw - 400px) / (800 - 400))) !important;
}

.ytick > text {
    font-size: calc(10px + (24 - 10) * ((100vw - 400px) / (800 - 400))) !important;
}

.xtick > text {
    font-size: calc(10px + (24 - 10) * ((100vw - 400px) / (800 - 400))) !important;
}

body > div {
    width: 100%;
    height: 100%;
}
</style>
`;

export const MATPLOTLIB_FIGURE_STYLE = `
<style>
body, html {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}

body > img {
    width: 100%;
}
</style>
`;

// export function changeTheme(
//   theme: string,
//   iframeRef: RefObject<HTMLIFrameElement>,
// ) {
//   console.log("iframeRef", iframeRef);
//   if (iframeRef?.current?.contentWindow) {
//     const message = { __name__: "CHANGE_THEME", themeColor: theme };
//     iframeRef.current.contentWindow.postMessage(message, "*"); // Use a specific domain instead of '*' for better security
//   }
// }

type IDefaultHTMLRenderProps = {
  shape: ICodeplotShape;
};

export const DefaultHTMLRender = observer(
  ({ shape }: IDefaultHTMLRenderProps) => {
    const iframeRef = useRef(null);
    return (
      <iframe
        ref={iframeRef}
        className="peer w-full h-full"
        sandbox="allow-same-origin allow-scripts"
        srcDoc={`
        <html data-theme-color=${appStore.theme.color}></html>
        ${GLOBAL_STYLE}
        ${GLOBAL_IFRAME_SCRIPT}
        ${shape.props.type.includes("pandas") ? DATAFRAME_TABLE_STYLE : ""}
        ${shape.props.type.includes("polars") ? DATAFRAME_TABLE_STYLE : ""}
        ${shape.props.type.includes("plotly") ? PLOTLY_FIGURE_STYLE : ""}
        ${shape.props.type.includes("matplotlib/figure") ? MATPLOTLIB_FIGURE_STYLE : ""}
        ${shape.props.mime["text/html"]}`}
      />
    );
  },
);
