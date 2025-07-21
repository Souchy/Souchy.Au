import { IRouter, ICurrentRoute, INavigationModel, IRouteContext, IRouterEvents, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationStartEvent, ParameterInformation, route } from '@aurelia/router';
import { routes, PageClass } from './routes';
import { EventAggregator, IDisposable, IEventAggregator, inject, lazy, resolve } from 'aurelia';

@route({
  routes: routes,
  fallback: import('./missing-page/missing-page'),
})
@inject(EventAggregator, IRouterEvents, ICurrentRoute, IRouter)
export class MyApp implements IDisposable {
  // private readonly currentRoute: ICurrentRoute = resolve(ICurrentRoute);
  private sidebar: PageClass;
  private routess = routes;
  // private readonly nav_model: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;
  private readonly routeContext = resolve(lazy(IRouteContext));

  private readonly subscriptions: IDisposable[];
  public log: string[] = [];

  constructor(private ea: EventAggregator, events: IRouterEvents, private currentRoute: ICurrentRoute) {
    console.log("ctor curr route: ", currentRoute);
    
    // this.ea.subscribe("au:router:navigation-end", () => this.onNavEnd);
    // const events = resolve(IRouterEvents);
    this.subscriptions = [
      events.subscribe('au:router:location-change', (event: LocationChangeEvent) => {
        console.log("on nav change", event);
      }),
      events.subscribe('au:router:navigation-start', (event: NavigationStartEvent) => {
        console.log("on nav start", event);
      }),
      events.subscribe('au:router:navigation-end', (event: NavigationEndEvent) => {
        console.log("on nav end", event);
        console.log(`-currentRoute: `, this.currentRoute);
        console.log(`-path: ${this.currentRoute.path}`);
        console.log(`-url: ${this.currentRoute.url}`);
        console.log(`-title: ${this.currentRoute.title}`);
        console.log(`-query: ${this.currentRoute.query}`);
      }),
      events.subscribe('au:router:navigation-cancel', (event: NavigationCancelEvent) => {
        console.log("on nav cancel", event);
      }),
      events.subscribe('au:router:navigation-error', (event: NavigationErrorEvent) => {
        console.log("on nav error", event);
      }),
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

  // public async binding() {
  //   await this.nav_model.resolve()
  // }

  public attached(): void {
    console.log(`currentRoute: `, this.currentRoute);
    console.log(`path: ${this.currentRoute.path}`);
    console.log(`url: ${this.currentRoute.url}`);
    console.log(`title: ${this.currentRoute.title}`);
    console.log(`query: ${this.currentRoute.query}`);

    for (const pi of this.currentRoute.parameterInformation) {
      this.logParameterInstruction(pi);
    }
  }
  private logParameterInstruction(pi: ParameterInformation): void {
    console.log(`config: ${pi.config.id}`);
    console.log(`viewport: ${pi.viewport}`);
    console.log(`params:`, pi.params);
    pi.children.forEach((c) => this.logParameterInstruction(c));
  }

  // private onNavEnd(ev) {
  //   console.log("on nav end: ", ev)
  // }

}
