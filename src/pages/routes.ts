import { Routeable } from "@aurelia/router";

export type PageClass = new (...args: any[]) => any;

// Eagerly import all page modules and HTML-only views
// const modulePages = import.meta.glob('./*/!(*.stories).ts', { eager: true });
// const modulePages: Record<string, Record<string, any>> = import.meta.glob('./*-page.ts', { eager: true });
const modulePages: Record<string, Record<string, any>> = import.meta.glob('./*/!(*.stories)!(*-side).ts', { eager: true });
const moduleSidebars: Record<string, Record<string, any>> = import.meta.glob('./**/*-side.ts', { eager: true });
// console.log('Found sidebars:', moduleSidebars);
// console.log(`Found ${Object.keys(modulePages)} page modules.`);

export const foundRoutes: Routeable[] = [];
/** <route.title, sidebar component> */
export const foundSidebars = new Map<string, PageClass>();

function getComponent(path: string, mod: Record<string, any> | undefined) {
	if (!mod) return undefined;
	// Find the exported class
	const exportKey = Object.keys(mod).find(k => /^[A-Z]/.test(k));
	const component = exportKey ? mod[exportKey] : undefined;
	return component;
}

for (const [path, mod] of Object.entries(modulePages)) {
	if (path.endsWith("-side.ts")) continue;
	// Find the exported class
	const component = getComponent(path, mod);

	// Extract the page folder name
	let slashIndex = path.lastIndexOf('/');
	let folder = path.substring(0, slashIndex);
	let filename = path.substring(slashIndex + 1);
	const name = filename.replace(/\.ts$/, '');
	const nameWithoutPage = name.replace(/-page$/, '');
	// console.log(`Found page: `, path, folder, name);

	// path
	// let routePath: string | string[] = name === defaultPage ? ['', nameWithoutPage] : nameWithoutPage;
	let routePath: string | string[] = nameWithoutPage;

	// title
	let title = nameWithoutPage
		.replace(/-/g, ' ') // replace "-"" with space
		.replace(/(^\w|\s\w)/g, l => l.toUpperCase()); // capitalize first letter of each word

	let module: Routeable = {
		path: routePath,
		component,
		title,
		// name: nameWithoutPage,
	};
	// console.log(`Adding route:`, module);
	foundRoutes.push(module);

	const sidebarPath = `${folder}/${nameWithoutPage}-side.ts`;
	const sidebarMod = moduleSidebars[sidebarPath];
	// console.log(`Looking for sidebar at:`, sidebarPath);
	const sideComponent = getComponent(sidebarPath, sidebarMod);
	if (sideComponent) {
		foundSidebars.set(title, sideComponent);
		// console.log(`Adding sidebar:`, sideComponent);
	}
}
