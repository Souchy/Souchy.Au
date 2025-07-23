import { bindable, IDisposable, inject, resolve, valueConverter } from 'aurelia';
import { ICurrentRoute, INavigationModel, IRouteConfig, IRouteContext, IRouterEvents, NavigationEndEvent, Routeable, RouteableComponent, RouteConfig } from '@aurelia/router';
import { FirstNonEmpty } from '../core/pipes';
const firstNonEmpty = new FirstNonEmpty();

@inject(IRouterEvents, ICurrentRoute)
export class NavBar {
	private readonly navContext = resolve(IRouteContext).routeConfigContext;
	private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;
	private routes: readonly Routeable[] = [];

	@bindable parent: string;

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute) {
	}

	public async binding() {
		await this.navModel.resolve()
	}
	public attached() {
		if (this.parent) {
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
	}

	getLink(route: RouteConfig) {
		// console.log("get link")
		if (route.data.parent)
			return `${route.data.parent}/${firstNonEmpty.toView(route.path)}`;
		else
			return firstNonEmpty.toView(route.path);
	}

	isActive(route: any) {
		// console.log("check route is active")
		// route.id == currentRoute.id
		// return this.currentRoute.path[0] == "demo"; // route["isActive"];
		
		// console.log("isActive route: ", route["isActive"]);
		return this.currentRoute.path == route["id"]; // firstNonEmpty.toView(route.path);
	}


}
