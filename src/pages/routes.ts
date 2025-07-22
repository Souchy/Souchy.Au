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

export class Routing {
	public static getRoutesFromComponent(component: any): any[] {
		console.log("getRoutes from ", component.constructor.name);
		if (!component.routes) return [];
		return component.routes.flatMap(route => {
			if (route.component && route.component.routes) {
				// get child routes recursively
				return [route, ...Routing.getRoutesFromComponent(route.component)];
			}
			return [route];
		});
	}
}

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
	if (!component) continue;

	// Extract the page folder name
	let slashIndex = path.lastIndexOf('/');
	let folder = path.substring(0, slashIndex);
	let folderName = folder.replace('./', ''); // remove leading './'
	folderName = folderName.replace(/\/pages\//, '/'); // remove '/pages/' from path

	let filename = path.substring(slashIndex + 1);

	const name = filename.replace(/\.ts$/, '');
	folderName = folderName.replace(name, ''); // remove name from folder
	folderName = folderName.replace(/-page/, '');
	folderName = folderName.replace(/\//, ''); // rename slashes

	let nameWithoutHyphen = name.replace(/-page$/, ''); //.split('-')[0]; //.replace(/-page$/, '');
	nameWithoutHyphen = nameWithoutHyphen.replace('-' + folderName, ''); // remove folder name from name
	// console.log(`Found page: `, path, folder, folderName, nameWithoutHyphen);

	// path
	let routePath: string | string[] = nameWithoutHyphen; //[folderName, nameWithoutHyphen].join('/'); // + '/' + nameWithoutHyphen;
	if (folderName) {
		routePath = folderName + '/' + nameWithoutHyphen;
	}
	// if(folder.includes("pages")) {
	// 	// If in a "pages" folder, use the folder name as a prefix
	// 	let parent_route = folder.split('pages')[0];
	// 	routePath = `${parent_route}${nameWithoutPage}`;
	// }

	// title
	let title = nameWithoutHyphen
		.replace(/-/g, ' ') // replace "-"" with space
		.replace(/(^\w|\s\w)/g, l => l.toUpperCase()); // capitalize first letter of each word


	let module: Routeable = {
		id: routePath, // use path as id
		path: routePath,
		component,
		title,
	};

	let extension = component?.extension as RouteExtension || new RouteExtension();
	extension.viewport ??= 'default';

	if (extension.autoroute === false) {
		// console.log(`Skipping autoroute for:`, module);
		continue;
	}

	// if no sidebar extension, find a *-side.ts component.
	if (!extension?.sidebar) {
		const sidebarPath = `${folder}/${nameWithoutHyphen}-side.ts`;
		const sidebarMod = moduleSidebars[sidebarPath];
		const sideComponent = getComponent(sidebarPath, sidebarMod);
		extension.sidebar = sideComponent;
	}

	// if (extensions.defaultPage) {
	// 	module = {
	// 		path: ['', nameWithoutPage],
	// 		component,
	// 		title,
	// 	}
	// }

	if (extension.icon) {
		// module.icon = extensions.icon;
	}
	if (extension.viewport) {
		// module.viewport = extensions.viewport;
	}

	// console.log(`Adding route:`, module);
	// console.log(`Adding route:`, module, extension);

	// push route
	if (!routesByViewport.has(extension.viewport)) {
		routesByViewport.set(extension.viewport, []);
	}
	routesByViewport.get(extension.viewport)!.push(module);

	// push extension by route title
	if (!extensionsByViewport.has(extension.viewport)) {
		extensionsByViewport.set(extension.viewport, new Map<string, RouteExtension>());
	}
	extensionsByViewport.get(extension.viewport)!.set(routePath, extension);
	// console.log(`Adding extension for ${extensions.viewport}:`, routePath, extensions);

}
