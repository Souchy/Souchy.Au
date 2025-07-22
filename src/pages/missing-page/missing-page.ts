import { RouteExtension } from "../routes";
import { route } from "@aurelia/router";

@route({
  path: 'missing',
  title: 'Missing page',
  // data: {
  //   i18n: 'routes.about'
  // }
})
export class MissingPage {
  public static readonly extension: RouteExtension = {
    autoroute: false, // don't autoroute this page
  };

  public missingComponent: string = 'Unknown page';
}
