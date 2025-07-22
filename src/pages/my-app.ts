import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route, Routeable, IRouteConfig, RouteNode } from '@aurelia/router';
import { foundRoutes, PageClass, foundExtensions, extensionsByViewport, routesByViewport, Routing } from './routes';
import { IDisposable, inject } from 'aurelia';

import { resolve } from 'aurelia';
import { INavigationModel, IRouteContext } from '@aurelia/router';
import { SettingsPage } from './settings-page/settings-page';
import { WelcomePage } from './welcome-page/welcome-page';
import { Demo } from './demo/demo';
import { ComeBack } from './come-back/come-back';
import { AboutPage } from './about-page/about-page';

@route({
  fallback: import('./missing-page/missing-page'),
})
@inject(IRouterEvents, ICurrentRoute, IRouter)
export class MyApp implements IDisposable {
  // corresponds to the `routes` property in the options object used in the @route decorator.
  static routes: Routeable[] = [
    {
      path: ['welcome'],
      redirectTo: ''
    },
    WelcomePage,
    SettingsPage,
    Demo,
    ComeBack,
    AboutPage
  ];

  private sidebar: PageClass | undefined = undefined;
  private readonly subscriptions: IDisposable[];
  // private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;

  constructor(private events: IRouterEvents, private currentRoute: ICurrentRoute, private router: IRouter) {
    console.log("ctor curr route: ", currentRoute);
    // this.router.getRouteContext(this);
    this.subscriptions = [
      events.subscribe('au:router:navigation-end', (e: NavigationEndEvent) => this.onNavEnd(e)),
    ];
  }

  public get routes() {
    // console.log("MyApp routes: ", routesByViewport.get('default'));
    return routesByViewport.get('default') || []; //foundRoutes;
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
    let path = this.currentRoute.path == '' ? 'welcome' : this.currentRoute.path;
    let viewportName = path.includes('/') ? path.split('/')[0] : 'default';
    this.sidebar = extensionsByViewport.get(viewportName)?.get(path)?.sidebar;
    // console.log("nav curr route: ", viewportName, this.currentRoute, this.sidebar);
    // console.log("navModel:", this.navModel);
    // console.log("nav curr route: ", this.router.routeTree.root.children);
    // console.log("nav MYAPP routes: ", Routing.getRoutesFromComponent(this));
    // console.log("myapp routes: ", this.getRouteConfig(null, null));

    console.log("routing routes(default): ", routesByViewport.get('default'));
    console.log("myapp comp: ", MyApp);
    console.log("myapp routes: ", MyApp.routes);
  }

}
