import { bindable, customElement, IDisposable, inject, resolve, valueConverter } from 'aurelia';
import { ICurrentRoute, INavigationModel, IRouteConfig, IRouteContext, IRouterEvents, NavigationEndEvent, Routeable, RouteableComponent, RouteConfig } from '@aurelia/router';
import { FirstNonEmpty } from '../../core/pipes';
const firstNonEmpty = new FirstNonEmpty();

@inject(IRouterEvents, ICurrentRoute)
@customElement('navbar')
export class NavBar {
	private readonly navContext = resolve(IRouteContext).routeConfigContext;
	private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;
	private routes: readonly Routeable[] = [];

	@bindable mode: 'h' | 'v' | 'vertical' | 'horizontal' = 'h';
	@bindable parent: string = '';
	@bindable id: string = '';

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute) {
		events.subscribe('au:router:navigation-end', (e: NavigationEndEvent) => this.onNavEnd(e));
	}

	public async binding() {
		await this.navModel.resolve()
	}
	public attached() {
		// console.log("navbar (" + this.id + ") (" + this.parent + ") attach", this.currentRoute)
		// console.log("navbar (" + this.id + ") navModel: ", this.navModel);
		// console.log("navbar (" + this.id + ") navContext: ", this.navContext);
		this.routes = this.navModel.routes;
		if (this.parent) {
			let parentRoute = this.navContext.childRoutes.find((r: RouteConfig) => r.id === this.parent) as RouteConfig;
			if (parentRoute)
				this.routes = parentRoute?.routes.map(r => {
					const symbolKey = "au:resource:route-configuration";
					const symbols = Object.getOwnPropertySymbols(r);
					return r[symbols[0]][symbolKey];
				}) || [];
		}
		// console.log("navbar (" + this.id + ") routes: ", this.routes);
	}

	getLink(route: RouteConfig) {
		// console.log("get link")
		
		let link = firstNonEmpty.toView(route.path);
		if (route.data.parent == this.parent)
			link = `${route.data.parent}/${firstNonEmpty.toView(route.path)}`;
		
		let base = this.id.replace('-nav', '');
		link = link.replace(base + '/', '');

		// console.log("nav (" + this.id + ") (" + this.parent + ") current route: " + this.currentRoute.path + ", get route link ", link);
		return link;
		// if (route.data.parent == this.parent)
		// 	return `${route.data.parent}/${firstNonEmpty.toView(route.path)}`;
		// else
		// 	return firstNonEmpty.toView(route.path);
	}

	isActive(route: RouteConfig) {
		// console.log("check route is active")
		// route.id == currentRoute.id
		// return this.currentRoute.path[0] == "demo"; // route["isActive"];

		// console.log("isActive route: ", route["isActive"]);
		// if(this.currentRoute.path == route.id)
		// 	return true;
		let isActive = false;

		// console.log("curr route path: ", this.parent, this.currentRoute.path);
		for (let path of route.path) {
			// let path = route.data?.parent ?? '';
			// console.log("path: ", path);
			if (route.data.parent) {
				if (this.currentRoute.path == route.data.parent + '/' + path)
					isActive = true;
				if (path == '' && this.currentRoute.path == route.data.parent)
					isActive = true;
			}
			if (this.currentRoute.path == path) {
				//path == '' && this.currentRoute.path == '')
				// console.log("path = path: " + path);
				isActive = true;
			}
		}
		if (this.currentRoute.path == route.id)
			isActive = true;

		// if (isActive)
		// 	console.log("isActive : " + this.parent + ", " + route.id + " vs " + this.currentRoute.path + " = " + isActive)
		return isActive;
	}

	private onNavEnd(event: NavigationEndEvent): void {
		// let path = this.currentRoute.path == '' ? 'welcome' : this.currentRoute.path;
		// let viewportName = path.includes('/') ? path.split('/')[0] : 'default';
		// this.sidebar = extensionsByViewport.get(viewportName)?.get(path)?.sidebar;
		// console.log("nav curr route: ", this.currentRoute, this.sidebar); // viewportName
		// console.log("navbar curr route: ", this.currentRoute);
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
