import { IRouter, ICurrentRoute, IRouterEvents, NavigationEndEvent, route } from '@aurelia/router';
import { foundRoutes, PageClass, foundSidebars } from './routes';
import { EventAggregator, IDisposable, inject } from 'aurelia';

@route({
  routes: [
    {
      path: [''],
      component: import('./welcome-page/welcome-page'),
      title: 'Welcome',
    },
    ...foundRoutes
  ],
  fallback: import('./missing-page/missing-page'),
})
@inject(EventAggregator, IRouterEvents, ICurrentRoute, IRouter)
export class MyApp implements IDisposable {
  private sidebar: PageClass | undefined = undefined;
  private readonly subscriptions: IDisposable[];

  constructor(events: IRouterEvents, private currentRoute: ICurrentRoute) {
    this.subscriptions = [
      events.subscribe('au:router:navigation-end', this.onNavEnd.bind(this)),
    ];
  }

  public get routes() {
    return foundRoutes;
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
    console.log("nav curr route: ", this.currentRoute);
    this.sidebar = foundSidebars.get(this.currentRoute.title);
  }

}
