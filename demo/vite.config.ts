import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import aurelia from '@aurelia/vite-plugin';
import path from 'path';

// export default defineConfig({
//   server: {
//     open: !process.env.CI,
//     port: 1333,
//   },
//   esbuild: {
//     target: 'es2022'
//   },
//   plugins: [
//     aurelia({
//       useDev: true,
//     }),
//     nodePolyfills(),
//   ],
//   resolve: {
//     alias: {
//       "souchy.au": "/src",
//     },
//   },
// });

// import { defineConfig } from 'vite';
// import aurelia from '@aurelia/vite-plugin';

export default defineConfig({
  root: __dirname, // Serve from /demo folder
  plugins: [
    aurelia({
      useDev: true,
    }),
    nodePolyfills(),
  ],
  server: {
    open: !process.env.CI,
    port: 1333,
  },
  // build: {
  //   outDir: '../dist-demo'
  // },
  resolve: {
    alias: {
      'souchy.au': path.resolve(__dirname, '../src')
    }
  }
});
