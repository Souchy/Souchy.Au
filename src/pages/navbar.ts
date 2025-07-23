import { bindable, inject, resolve, valueConverter } from 'aurelia';
import { ICurrentRoute, INavigationModel, IRouteContext, IRouterEvents, NavigationEndEvent, Routeable, RouteConfig } from '@aurelia/router';
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
		console.log("routes: ", this.routes);
	}

	getLink(route: RouteConfig) {
		if (route.data.parent)
			return `${route.data.parent}/${firstNonEmpty.toView(route.path)}`;
		else
			return firstNonEmpty.toView(route.path);
	}

}
