import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { AliasOptions, defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

let alias: AliasOptions;
if (process.env.APP_ENV === 'development') {
  alias = [
    { find: /^@core\/(.*)/, replacement: path.resolve(__dirname, 'src/app/core/$1') },
    { find: /^@features\/(.*)/, replacement: path.resolve(__dirname, 'src/app/features/$1') },
    { find: /^@shared\/(.*)/, replacement: path.resolve(__dirname, 'src/app/shared/$1') },
  ]
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), svgr(), tsconfigPaths()],
  // resolve: {
  //   alias
  // },
})
