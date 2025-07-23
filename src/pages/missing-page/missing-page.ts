import { route } from "@aurelia/router";

@route({
  id: 'missing',
  path: 'missing',
  title: 'Missing page',
  data: {
    i18n: 'routes:missing'
  }
})
export class MissingPage {
  public missingComponent: string = 'Unknown page';
}
