import { defineConfig } from "vite";
// eslint-disable-next-line
import react from '@vitejs/plugin-react'
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr(), mkcert()],
});
