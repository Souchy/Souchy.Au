import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route, Routeable, IRouteConfig, RouteNode } from '@aurelia/router';
import { IDisposable, inject } from 'aurelia';

import { SettingsPage } from './settings-page/settings-page';
import { WelcomePage } from './welcome-page/welcome-page';
import { Demo } from './demo/demo';
import { ComeBack } from './come-back/come-back';
import { AboutPage } from './about-page/about-page';

@route({
  routes: [
    // {
    //   path: ['welcome'],
    //   redirectTo: ''
    // },
    WelcomePage,
    Demo,
    ComeBack,
    SettingsPage,
    AboutPage
  ],
  fallback: import('./missing-page/missing-page'),
})
@inject(IRouterEvents, ICurrentRoute, IRouter)
export class MyApp implements IDisposable {
  private sidebar: any;
  private readonly subscriptions: IDisposable[];

  constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute, private router: IRouter) {
    console.log("ctor curr route: ", currentRoute);
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
    // console.log("nav curr route: ", this.currentRoute, this.sidebar); // viewportName

    let config = this.currentRoute.parameterInformation[0].config;
    if (config) {
      console.log("nav curr route config: ", config);
      this.sidebar = (config as IRouteConfig).data?.sidebar;
    }
  }

}
