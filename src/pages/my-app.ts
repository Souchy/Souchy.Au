import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route } from '@aurelia/router';
import { foundRoutes, PageClass, foundExtensions, extensionsByViewport, routesByViewport } from './routes';
import { IDisposable, inject } from 'aurelia';

@route({
  routes: [
    {
      path: [''],
      id: 'welcome',
      component: import('./welcome-page/welcome-page'),
      title: 'Welcome',
    },
    ...routesByViewport.get('default') || [], // default viewport routes
    // ...foundRoutes
  ],
  fallback: import('./missing-page/missing-page'),
})
@inject(IRouterEvents, ICurrentRoute, IRouter)
export class MyApp implements IDisposable {
  private sidebar: PageClass | undefined = undefined;
  private readonly subscriptions: IDisposable[];

  constructor(events: IRouterEvents, private currentRoute: ICurrentRoute) {
    console.log("ctor curr route: ", currentRoute);
    this.subscriptions = [
      events.subscribe('au:router:navigation-end', (e: NavigationEndEvent) => this.onNavEnd(e)),
    ];
  }

  public get routes() {
    console.log("MyApp routes: ", routesByViewport.get('default'));
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
    console.log("nav curr route: ", viewportName, this.currentRoute, this.sidebar);
  }

}
