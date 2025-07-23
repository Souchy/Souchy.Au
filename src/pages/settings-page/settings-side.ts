import { inject, resolve, valueConverter } from 'aurelia';
import { ICurrentRoute, INavigationModel, IRouteContext, IRouterEvents, NavigationEndEvent, Routeable, RouteConfig } from '@aurelia/router';
import { FirstNonEmpty } from '../../core/pipes';
const firstNonEmpty = new FirstNonEmpty();

@inject(IRouterEvents, ICurrentRoute)
export class SettingsSide {
	private readonly navContext = resolve(IRouteContext).routeConfigContext;
	private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;
	private routes: readonly Routeable[] = [];

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute) {
		// this.subscriptions = [
		// events.subscribe('au:router:navigation-end', this.onNavEnd); //(e: NavigationEndEvent) => this.onNavEnd(e)),
		// ];
	}

	public async binding() {
		await this.navModel.resolve()
		// this.navModel.routes[0].
		// console.log("settings routes: ", this.navModel);
		// console.log('settings context:', this.navContext);

		let settingsRoute = this.navContext.childRoutes.find((r: RouteConfig) => r.id === 'settings') as RouteConfig;
		this.routes = settingsRoute?.routes.map(r => {
			const symbolKey = "au:resource:route-configuration";
			const symbols = Object.getOwnPropertySymbols(r);
			return r[symbols[0]][symbolKey];
		}) || [];
		// console.log('settings routes:', this.routes);
	}
	
	getLink(route) {
		return `${route.data.parent}/${firstNonEmpty.toView(route.path)}`;
	}
}
