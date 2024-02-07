import { useRef } from "react";
import { ICodeplotShape } from "./ICodeplotShape";

const _GLOBAL_IFRAME_SCRIPT = `
<script>
    window.addEventListener('message', function(event) {
        console.log(event.origin)
        // if (event.origin !== 'https://localhost:5173' && event.origin !== 'https://codeplot.co') return;

        console.log('Received message from parent:', event.data);

        // Check if the message contains theme information
        if (event.data.__name__ === 'CHANGE_THEME') {
            // Apply the theme based on the message
            document.documentElement.setAttribute('data-theme-color', event.data.themeColor);
            // Update your CSS variables or classes based on the theme as needed
        }
    }, false);
</script>
`;

const _GLOBAL_STYLE = `
<style>
html, body {
    padding: 0;
    margin: 0;
    font-family: 'DM Mono', sans-serif;
    font-size: 12px;
    background-color: var(--background-color);
    color: var(--text-color);
}
/* custom scrollbar */
::-webkit-scrollbar {
width: 16px;
}

::-webkit-scrollbar-track {
background-color: transparent;
}

::-webkit-scrollbar-thumb {
background-color: #d6dee1;
border-radius: 20px;
border: 6px solid transparent;
background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
background-color: #a8bbbf;
}

::-webkit-scrollbar-corner {
    background-color: transparent;
}
</style>
`;

export const PANDAS_TABLE_STYLE = `
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
  isInteractive: boolean;
};

export function DefaultHTMLRender({
  shape,
  isInteractive,
}: IDefaultHTMLRenderProps) {
  const iframeRef = useRef(null);
  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      sandbox="allow-same-origin allow-scripts"
      srcDoc={`
        ${_GLOBAL_STYLE}
        ${_GLOBAL_IFRAME_SCRIPT}
        ${shape.props.type.includes("pandas") ? PANDAS_TABLE_STYLE : ""}
        ${shape.props.type.includes("plotly") ? PLOTLY_FIGURE_STYLE : ""}
        ${shape.props.type.includes("matplotlib/figure") ? MATPLOTLIB_FIGURE_STYLE : ""}
        ${shape.props.staticMimes["text/html"]}`}
      style={{
        border: 0,
        pointerEvents: isInteractive ? "auto" : "none",
        // Fix for safari <https://stackoverflow.com/a/49150908>
        zIndex: isInteractive ? "" : "-1",
        // boxShadow: getRotatedBoxShadow(pageRotation),
        // borderRadius: embedInfo?.definition.overrideOutlineRadius ?? 8,
        // background: embedInfo?.definition.backgroundColor,
      }}
    />
  );
}
