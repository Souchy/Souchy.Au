import { RouteExtension } from "../routes";

export class MissingPage {
  public static readonly extension: RouteExtension = {
    autoroute: false, // don't autoroute this page
  };

  public missingComponent: string = 'Unknown page';
}
