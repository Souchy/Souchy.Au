import { route, Routeable } from "@aurelia/router";

export type PageClass = new (...args: any[]) => any;
export class RouteExtension {
	defaultPage?: boolean = false;
	autoroute?: boolean = true;
	sidebar?: PageClass;
	icon?: string;
	viewport?: string = 'default'; // default, settings...
}

// Eagerly import all page modules and HTML-only views
// const modulePages = import.meta.glob('./*/!(*.stories).ts', { eager: true });
// const modulePages: Record<string, Record<string, any>> = import.meta.glob('./*-page.ts', { eager: true });
const modulePages: Record<string, Record<string, any>> = import.meta.glob('./*/**/!(*.stories)!(*-side).ts', { eager: true });
const moduleSidebars: Record<string, Record<string, any>> = import.meta.glob('./*/**/*-side.ts', { eager: true });
// console.log('Found sidebars:', moduleSidebars);
// console.log(`Found ${Object.keys(modulePages)} page modules.`);

export const foundRoutes: Routeable[] = [];
/** <route.title, extension> */
export const foundExtensions = new Map<string, RouteExtension>();

// export const found: Map<string, ([Routeable, RouteExtension])[]> = new Map<string, ([Routeable, RouteExtension])[]>();
export const routesByViewport: Map<string, Routeable[]> = new Map<string, Routeable[]>();
export const extensionsByViewport: Map<string, Map<string, RouteExtension>> = new Map<string, Map<string, RouteExtension>>();

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
	if(!component) continue;

	// Extract the page folder name
	let slashIndex = path.lastIndexOf('/');
	let folder = path.substring(0, slashIndex);
	let filename = path.substring(slashIndex + 1);
	const name = filename.replace(/\.ts$/, '');
	const nameWithoutPage = name.replace(/-page$/, '');
	console.log(`Found page: `, path, folder, name);

	// path
	let routePath: string | string[] = nameWithoutPage;
	if(folder.includes("pages")) {
		// If in a "pages" folder, use the folder name as a prefix
		let parent_route = folder.split('pages')[0];
		routePath = `${parent_route}${nameWithoutPage}`;
	}

	// title
	let title = nameWithoutPage
		.replace(/-/g, ' ') // replace "-"" with space
		.replace(/(^\w|\s\w)/g, l => l.toUpperCase()); // capitalize first letter of each word


	let module: Routeable = {
		path: routePath,
		component,
		title,
	};

	let extensions = component?.extension as RouteExtension || new RouteExtension();
	extensions.viewport ??= 'default';

	if (extensions.autoroute === false) {
		console.log(`Skipping autoroute for:`, module);
		continue;
	}

	// if no sidebar extension, find a *-side.ts component.
	if (!extensions?.sidebar) {
		const sidebarPath = `${folder}/${nameWithoutPage}-side.ts`;
		const sidebarMod = moduleSidebars[sidebarPath];
		const sideComponent = getComponent(sidebarPath, sidebarMod);
		extensions.sidebar = sideComponent;
	}

	// if (extensions.defaultPage) {
	// 	module = {
	// 		path: ['', nameWithoutPage],
	// 		component,
	// 		title,
	// 	}
	// }

	if (extensions.icon) {
		// module.icon = extensions.icon;
	}
	if (extensions.viewport) {
		// module.viewport = extensions.viewport;
	}

	console.log(`Adding route:`, module);

	// push route
	if (!routesByViewport.has(extensions.viewport)) {
		routesByViewport.set(extensions.viewport, []);
	}
	routesByViewport.get(extensions.viewport)!.push(module);

	// push extension by route title
	if (!extensionsByViewport.has(extensions.viewport)) {
		extensionsByViewport.set(extensions.viewport, new Map<string, RouteExtension>());
	}
	extensionsByViewport.get(extensions.viewport)!.set(title, extensions);

}
