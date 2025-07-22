import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route } from '@aurelia/router';
import { foundRoutes, PageClass, foundExtensions, extensionsByViewport, routesByViewport } from '../routes';
import { IDisposable, inject } from 'aurelia';
import { GeneralSettings } from './pages/general-settings/general-settings';
import { AccountSettings } from './pages/account-settings/account-settings';

@route({
	routes: [
		{
			path: [''],
			component: GeneralSettings,
			title: 'General',
		},
		// ...routesByViewport.get('settings') || [], // default viewport routes
		// ...foundRoutes
		{
			path: ['general'],
			component: GeneralSettings,
			title: 'General',
		},
		{
			path: ['account'],
			component: AccountSettings,
			title: 'Account',
		},
	],
	//   fallback: import('./missing-page/missing-page'),
})
@inject(IRouterEvents, ICurrentRoute, IRouter)
export class SettingsPage implements IDisposable {

	constructor(events: IRouterEvents, private currentRoute: ICurrentRoute) {
		console.log("ctor SETTINGS curr route: ", currentRoute);
		// console.log("SettingsPage routes: ", routesByViewport.get('settings'));
		// this.subscriptions = [
		//   events.subscribe('au:router:navigation-end', (e: NavigationEndEvent) => this.onNavEnd(e)),
		// ];
	}
	dispose(): void {
		// throw new Error('Method not implemented.');
	}

	// public get routes() {
	// 	console.log("SettingsPage routes: ", routesByViewport.get('settings'));
	// 	return routesByViewport.get('settings') || []; //foundRoutes;
	// }

}
