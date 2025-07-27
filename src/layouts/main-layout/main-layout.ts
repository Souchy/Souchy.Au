import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route, Routeable, IRouteConfig, RouteNode, ParameterInformation } from '@aurelia/router';
import { bindable, IDisposable, inject } from 'aurelia';

/**
 * How do we do routes???
 */
@inject(IRouterEvents, ICurrentRoute, IRouter)
export class MainLayout implements IDisposable {
	private sidebar: any;
	private readonly subscriptions: IDisposable[];
	@bindable id: string;
	@bindable mode: 'column' | 'row' = 'column';
	@bindable defaultSizes: number[] = [20, 80];

	constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute, private router: IRouter) {
		this.subscriptions = [
			events.subscribe('au:router:navigation-end', (e: NavigationEndEvent) => this.onNavEnd(e)),
		];
	}

	public dispose(): void {
		const subscriptions = this.subscriptions;
		this.subscriptions.length = 0;
		const len = subscriptions.length;
		for (let i = 0; i < len; i++) {
			subscriptions[i].dispose();
		}
	}

	private onNavEnd(event: NavigationEndEvent): void {
		let parts = window.location.pathname.split('/');
		// console.log("getSidebar (" + this.id + ") parts: ", parts, this.currentRoute);
		/* 
		quand id = '': id == parts[0] donc prend sidebar de parts[1]
		quand id = 'settings': id == parts[1] donc prend sidebar de parts[2]
		*/
		let routeable = this.currentRoute.parameterInformation[0];

		for (let i = 0; i < parts.length; i++) {
			if (parts[i] === this.id && i + 1 < parts.length) {
				this.sidebar = routeable?.config?.data?.sidebar;
				break;
			} else if (routeable.children && routeable.children.length > 0) {
				routeable = routeable.children[0];
			}
		}
		// console.log("getSidebar (" + this.id + ") = ", this.sidebar);
	}

}
