export const GLOBAL_IFRAME_SCRIPT = `
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

export const GLOBAL_STYLE = `
<style>

:root {
    --codeplot-color-white: 0, 0%, 100%;
    --codeplot-color-yellow: 43, 65%, 50%;
    --codeplot-color-black: 0, 0%, 13%;

    --codeplot-color-surface: 0, 0%, 13%;
    --codeplot-color-surface1: 0, 0%, 16%;
    --codeplot-color-surface2: 0, 0%, 22%;
    --codeplot-color-surface3: 0, 0%, 27%;

    --background-color: hsla(var(--codeplot-color-surface), 1);

    --codeplot-surface-backgroundColor: hsla(var(--codeplot-color-surface), 1);
    --codeplot-surface-color: hsla(var(--codeplot-color-white), 80%);

    --codeplot-surface2-backgroundColor: hsla(
        var(--codeplot-color-surface2),
        100%
    );
    --codeplot-surface2-backgroundColorOnHover: hsla(
        var(--codeplot-color-surface2),
        100%
    );

    --scrollbar-thumb-backgroundColor: hsla(var(--codeplot-color-surface3), 1);
}


:root[data-theme-color="light"] {
    --codeplot-color-surface: 0, 0%, 100%;
    --codeplot-color-surface2: 0, 0%, 90%;
    --codeplot-color-surface2: 0, 0%, 80%;
    
    --codeplot-surface-color: hsla(var( --codeplot-color-surface), 100%);
    --codeplot-surface2-color: hsla(var( --codeplot-color-surface2), 100%);

    --scrollbar-thumb-backgroundColor: hsla(var(--codeplot-color-surface3), 1);
}

/* custom scrollbar */
::-webkit-scrollbar {
  width: 16px;
}

::-webkit-scrollbar-track {
  background-color: var(--codeplot-surface2-backgroundColor);
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-backgroundColor);
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-backgroundColor);
}

::-webkit-scrollbar-corner {
  background-color: var(--codeplot-surface2-backgroundColor);
}



html, body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 12px;
    background-color: var(--background-color);
    color: var(--text-color);
}
</style>
`;
