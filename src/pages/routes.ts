import { IChildRouteConfig, IRouteConfig, Routeable } from "@aurelia/router";

export type PageClass = new (...args: any[]) => any;
export interface Page extends IChildRouteConfig {
	readonly sidebar?: Routeable;
}

const defaultPage = "welcome-page";

// Eagerly import all page modules and HTML-only views
// const modulePages = import.meta.glob('./*/!(*.stories).ts', { eager: true });
const modulePages: Record<string, Record<string, any>> = import.meta.glob('./*/!(*.stories)!(*-side).ts', { eager: true });
// const modulePages: Record<string, Record<string, any>> = import.meta.glob('./*-page.ts', { eager: true });
const moduleSidebars: Record<string, Record<string, any>> = import.meta.glob('./*-side.ts', { eager: true });

// console.log(`Found ${Object.keys(modulePages)} page modules.`);
export const routes: Routeable[] = [];
export const sidebars = new Map<string, PageClass>();

function getComponent(path: string, mod: Record<string, any> | undefined) {
	if(!mod) return undefined;
	// Find the exported class
	const exportKey = Object.keys(mod).find(k => /^[A-Z]/.test(k));
	const component = exportKey ? mod[exportKey] : undefined;
	// if (!component) continue;
	return component;
}

for (const [path, mod] of Object.entries(modulePages)) {
	if(path.endsWith("-side.ts")) continue;
	// Find the exported class
	// const exportKey = Object.keys(mod).find(k => /^[A-Z]/.test(k));
	// const component: PageClass | undefined = exportKey ? mod[exportKey] : undefined;
	// if (!component) continue;
	const component = getComponent(path, mod);

	// Extract the page folder name
	let slashIndex = path.lastIndexOf('/');
	let filename = path.substring(slashIndex + 1);
	const name = filename.replace(/\.ts$/, '');
	const nameWithoutPage = name.replace(/-page$/, '');
	// console.log(`Found page: `, name);

	// path
	let routePath: string | string[] = name === defaultPage ? ['', nameWithoutPage] : nameWithoutPage;

	// title
	let title =
		nameWithoutPage
			.replace(/-/g, ' ') // replace "-"" with space
			.replace(/(^\w|\s\w)/g, l => l.toUpperCase()); // capitalize first letter of each word


	// const sidebarPath = `./sidebars/${nameWithoutPage}-sidebar.ts`;
	const sidebarPath = path.replace("-page", "-side");
	const sidebarMod = moduleSidebars[sidebarPath];
	const sideComponent = getComponent(sidebarPath, sidebarMod);
	
	let module: Page = {
		path: routePath,
		component,
		title,
		// sidebar: sideComponent
	};
	// sidebars[routePath] = sideComponent;
	sidebars.set(nameWithoutPage, sideComponent);


	console.log(`Adding route:`, module);
	routes.push(module);
}
