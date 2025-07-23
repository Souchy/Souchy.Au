import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route } from '@aurelia/router';
import { IDisposable, inject } from 'aurelia';
import { GeneralSettings } from './pages/general-settings/general-settings';
import { AccountSettings } from './pages/account-settings/account-settings';
import { SettingsSide } from './settings-side';

@route({
	id: 'settings',
	path: 'settings',
	title: 'Settings',
	data: {
		i18n: 'routes.settings',
		sidebar: SettingsSide,
		icon: 'bi-gear'
	},
	routes: [
		GeneralSettings,
		AccountSettings
	],
	fallback: import('../missing-page/missing-page'),
})
@inject(IRouterEvents, ICurrentRoute, IRouter)
export class SettingsPage implements IDisposable {
	private readonly subscriptions: IDisposable[];

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
		// let path = this.currentRoute.path == '' ? 'welcome' : this.currentRoute.path;
		// let viewportName = path.includes('/') ? path.split('/')[0] : 'default';
		// this.sidebar = extensionsByViewport.get(viewportName)?.get(path)?.sidebar;
		// console.log("nav curr route: ", viewportName, this.currentRoute, this.sidebar);
		// console.log("navModel:", this.navModel);
		// console.log("nav curr route: ", this.router.routeTree.root.children);
		// console.log("nav SETTINGS routes: ", Routing.getRoutesFromComponent(this));
	}

}
