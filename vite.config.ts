import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import aurelia from '@aurelia/vite-plugin';

/*
export default defineConfig({
  server: {
    open: !process.env.CI,
    port: 1333,
  },
  esbuild: {
    target: 'es2022'
  },
  plugins: [
    aurelia({
      useDev: true,
    }),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      "souchy.au": "/src",
    },
  },
  // build: {
  //   lib: {
  //     entry: 'src/index.ts',
  //     name: 'MyComponentLibrary',
  //     fileName: 'index'
  //   },
  //   rollupOptions: {
  //     external: ['aurelia'],
  //     output: {
  //       globals: { aurelia: 'Aurelia' }
  //     }
  //   }
  // }
});
*/

export default defineConfig({
  plugins: [aurelia()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SouchyAu',
      fileName: 'souchy-au'
    },
    rollupOptions: {
      external: ['aurelia'],
      output: {
        globals: {
          aurelia: 'Aurelia'
        }
      }
    }
  }
});
