import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route, Routeable, IRouteConfig, RouteNode } from '@aurelia/router';
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

    let config = this.currentRoute.parameterInformation[0].config;
    if (config) {
      console.log("nav curr route config: ", config);
      this.sidebar = (config as IRouteConfig).data?.sidebar;
    }
  }

}
