import { route } from "@aurelia/router";
import { RouteExtension } from "../routes";
import { OtherSide } from "./other-side";

@route({
  path: '',
  title: 'Welcome',
  data: {
    i18n: 'routes.welcome'
  }
})
export class WelcomePage {
  public static readonly extension: RouteExtension = {
    sidebar: OtherSide,
  };

  public message = 'Welcome to Aurelia 2!';

}
