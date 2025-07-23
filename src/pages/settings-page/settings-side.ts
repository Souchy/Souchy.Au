import { inject, resolve, valueConverter } from 'aurelia';
import { ICurrentRoute, INavigationModel, IRouteContext, IRouterEvents, NavigationEndEvent } from '@aurelia/router';

@valueConverter('firstNonEmpty')
class FirstNonEmpty {
	public toView(paths: string[]): string {
		for (const path of paths) {
			if (path) return path;
		}
	}
}

@inject(IRouterEvents, ICurrentRoute)
export class SettingsSide {
	private readonly navContext = resolve(IRouteContext).routeConfigContext;
	private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute) {
		// this.subscriptions = [
		// events.subscribe('au:router:navigation-end', this.onNavEnd); //(e: NavigationEndEvent) => this.onNavEnd(e)),
		// ];
	}

	public async binding() {
		await this.navModel.resolve()
		// console.log("settings routes: ", this.navModel.routes[1]);
		console.log('settings context:', this.navContext);
	}
}
