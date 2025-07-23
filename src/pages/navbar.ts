import { bindable, IDisposable, inject, resolve, valueConverter } from 'aurelia';
import { ICurrentRoute, INavigationModel, IRouteConfig, IRouteContext, IRouterEvents, NavigationEndEvent, Routeable, RouteableComponent, RouteConfig } from '@aurelia/router';
import { FirstNonEmpty } from '../core/pipes';
const firstNonEmpty = new FirstNonEmpty();

@inject(IRouterEvents, ICurrentRoute)
export class NavBar {
	private readonly navContext = resolve(IRouteContext).routeConfigContext;
	private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;
	private routes: readonly Routeable[] = [];

	@bindable parent: string = '';

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute) {
		events.subscribe('au:router:navigation-end', (e: NavigationEndEvent) => this.onNavEnd(e));
	}

	public async binding() {
		await this.navModel.resolve()
	}
	public attached() {
		if (this.parent) {
			console.log("navbar attach")
			let parentRoute = this.navContext.childRoutes.find((r: RouteConfig) => r.id === this.parent) as RouteConfig;
			this.routes = parentRoute?.routes.map(r => {
				const symbolKey = "au:resource:route-configuration";
				const symbols = Object.getOwnPropertySymbols(r);
				return r[symbols[0]][symbolKey];
			}) || [];
		} else {
			this.routes = this.navModel.routes;
		}
		// console.log(`navbar ${this.parent} routes: `, this.routes);
		// console.log(`navbar ${this.parent} curr: `, this.currentRoute)
		// for (const route of this.routes) {
		// 	const routeConfig = route as RouteConfig;
		// 	if (routeConfig.title == this.currentRoute.title) {
		// 		console.log("set route active: ", routeConfig.title)
		// 		routeConfig["isActive"] = true;
		// 	}
		// }
		// console.log("attach path: [" + this.currentRoute.path + "]");
		// for (let route of this.routes) {
		// 	const rc = route as RouteConfig;
		// 	console.log("navbar1 rc: ", rc);
		// 	if (this.currentRoute.path == rc.id) {
		// 		console.log("found1 active: ", this.currentRoute.path);
		// 		rc["isActive"] = true;
		// 	}
		// }
	}

	getLink(route: RouteConfig) {
		// console.log("get link")
		// console.log("get link current route: ", this.currentRoute.path)
		if (route.data.parent)
			return `${route.data.parent}/${firstNonEmpty.toView(route.path)}`;
		else
			return firstNonEmpty.toView(route.path);
	}

	isActive(route: RouteConfig) {
		// console.log("check route is active")
		// route.id == currentRoute.id
		// return this.currentRoute.path[0] == "demo"; // route["isActive"];

		// console.log("isActive route: ", route["isActive"]);
		// if(this.currentRoute.path == route.id)
		// 	return true;
		console.log("curr route path: ", this.parent, this.currentRoute.path);
		for (let path of route.path) {
			// let path = route.data?.parent ?? '';
			console.log("path: ", path);
			if (route.data.parent) {
				if (this.currentRoute.path == route.data.parent + '/' + path)
					return true;
				if (path == '' && this.currentRoute.path == route.data.parent)
					return true;
			}
			if (this.currentRoute.path == path) //path == '' && this.currentRoute.path == '')
				return true;
		}
		return this.currentRoute.path == route.id; // firstNonEmpty.toView(route.path);
	}

	private onNavEnd(event: NavigationEndEvent): void {
		// let path = this.currentRoute.path == '' ? 'welcome' : this.currentRoute.path;
		// let viewportName = path.includes('/') ? path.split('/')[0] : 'default';
		// this.sidebar = extensionsByViewport.get(viewportName)?.get(path)?.sidebar;
		// console.log("nav curr route: ", this.currentRoute, this.sidebar); // viewportName
		console.log("navbar curr route: ", this.currentRoute);
		// let config = this.currentRoute.parameterInformation[0].config;
		// for (let route of this.routes) {
		// 	const rc = route as RouteConfig;
		// 	console.log("navbar rc: ", rc);
		// 	if (this.currentRoute.path == firstNonEmpty.toView(rc.path)) {
		// 		console.log("found active: ", this.currentRoute.path);
		// 	}
		// }
		// if (config) {
		// 	// console.log("navbar curr route config: ", config);
		// 	// this.sidebar = (config as IRouteConfig).data?.sidebar;
		// }
	}

}
