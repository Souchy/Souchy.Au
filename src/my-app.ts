import { route, Routeable } from '@aurelia/router';

const defaultPage = "welcome-page";

// Eagerly import all page modules and HTML-only views
const modulePages = import.meta.glob('./ui/pages/*/!(*.stories).ts', { eager: true });
const routes = [];
for (const [path, mod] of Object.entries(modulePages)) {
  // Find the exported class
  const exportKey = Object.keys(mod).find(k => /^[A-Z]/.test(k));
  const component = exportKey ? mod[exportKey] : undefined;
  if (!component) continue;

  // Extract the page name
  const match = path.match(/ui\/pages\/([^\/]+)\//);
  const name = match ? match[1] : '';
  const nameWithoutPage = name.replace(/-page$/, '');

  // path
  let routePath: string | string[] = name === defaultPage ? ['', nameWithoutPage] : nameWithoutPage;

  // title
  let title =
    nameWithoutPage
      .replace(/-/g, ' ')
      .replace(/(^\w|\s\w)/g, l => l.toUpperCase());

  let module = {
    path: routePath,
    component,
    title,
  };
  routes.push(module);
}

@route({
  routes: routes,
  fallback: import('./ui/pages/missing-page/missing-page'),
})
export class MyApp {
}
