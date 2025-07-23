import { route } from "@aurelia/router";
import { title } from "process";


@route({
  id: 'about',
  path: 'about',
  title: 'About',
  data: {
    i18n: 'routes.about'
  }
})
export class AboutPage {
  public message = 'About Aurelia 2 Router';
} 
