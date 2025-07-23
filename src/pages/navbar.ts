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
export class NavBar {
	private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;

	// private sidebarComponent: PageClass | undefined = undefined;

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute) {
		// this.subscriptions = [
		// events.subscribe('au:router:navigation-end', this.onNavEnd); //(e: NavigationEndEvent) => this.onNavEnd(e)),
		// ];
	}

	public async binding() {
		await this.navModel.resolve()
		console.log("navModel routes: ", this.navModel.routes);
		console.log('Active segment:', this.currentRoute.path);
		console.log('Active query:', this.currentRoute.url.split('?')[1]);
	}

}
