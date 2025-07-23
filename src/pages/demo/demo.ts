import { route } from "@aurelia/router";

@route({
  id: 'demo',
  path: 'demo',
  title: 'Demo',
  data: {
    i18n: 'routes:demo'
  }
})
export class Demo {}
