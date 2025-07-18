import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import aurelia from '@aurelia/vite-plugin';
import dts from 'vite-plugin-dts';
import { dependencies } from "./package.json"

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
    dts({
      exclude: ['**/pages', '**/*.stories.ts', '**/*.test.ts', '**/*.d.ts', 'main.ts'],
      // include: ['src/**/*.ts', 'src/**/*.d.ts'],
      // insertTypesEntry: true,
      // staticImport: true,
      // respectExternal: true,
      // outputDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'souchy.au',
      fileName: (format) => `souchy.au.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: Object.keys(dependencies),
      output: {
        globals: {
          aurelia: 'Aurelia',
          '@aurelia/router': 'AureliaRouter',
        }
      }
    }
  },
});
