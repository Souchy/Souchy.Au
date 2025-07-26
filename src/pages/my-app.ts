import { route, Routeable } from '@aurelia/router';

const defaultPage = "welcome-page";

// Eagerly import all page modules and HTML-only views
const modulePages = import.meta.glob('./*/!(*.stories).ts', { eager: true });
// console.log(`Found ${Object.keys(modulePages)} page modules.`);
const routes = [];
for (const [path, mod] of Object.entries(modulePages)) {
  // Find the exported class
  const exportKey = Object.keys(mod).find(k => /^[A-Z]/.test(k));
  const component = exportKey ? mod[exportKey] : undefined;
  if (!component) continue;

  // Extract the page folder name
  let slashIndex = path.lastIndexOf('/');
  let filename = path.substring(slashIndex + 1);
  const name = filename.replace(/\.ts$/, '');
  const nameWithoutPage = name.replace(/-page$/, '');
  console.log(`Found page: `, name);

  // path
  let routePath: string | string[] = name === defaultPage ? ['', nameWithoutPage] : nameWithoutPage;

  // title
  let title =
    nameWithoutPage
      .replace(/-/g, ' ') // replace "-"" with space
      .replace(/(^\w|\s\w)/g, l => l.toUpperCase()); // capitalize first letter of each word

  let module = {
    path: routePath,
    component,
    title,
  };
  // console.log(`Adding route:`, module);
  routes.push(module);
}

@route({
  routes: routes,
  fallback: import('./missing-page/missing-page'),
})
export class MyApp {
}
