import { route } from "@aurelia/router";
import { OtherSide } from "./other-side";

@route({
  id: 'welcome',
  path: ['', 'welcome'],
  title: 'Welcome',
  data: {
    i18n: 'routes.welcome',
    sidebar: OtherSide
  }
})
export class WelcomePage {

  public message = 'Welcome to Aurelia 2!';

}
