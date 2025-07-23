import Aurelia, { AppTask, IEventAggregator } from 'aurelia';
import { IRouter, RouterConfiguration, Transition } from '@aurelia/router';
import { MyApp } from './my-app';
import * as SouchyAu from '../index';
import { I18N, I18nConfiguration, Signals } from '@aurelia/i18n';
import Fetch from 'i18next-fetch-backend';
import { FirstNonEmpty } from '../core/pipes';

const au = new Aurelia();
let i18n: I18N | null = null;

// Components
au.register(SouchyAu)
  .register(FirstNonEmpty);

// I18N
au.register(
  I18nConfiguration.customize((options) => {
    options.initOptions = {
      // debug: true,
      plugins: [Fetch],
      backend: {
        loadPath: './i18n/{{lng}}/{{ns}}.json',
      },
      // defaultNS: 'routes'
      ns: ['routes', 'common'],
      lng: 'fr',
    };
  }),
);

// Router
au.register(RouterConfiguration.customize({
  useNavigationModel: true,
  useUrlFragmentHash: false,
  activeClass: "toggled",
  buildTitle(tr: Transition) {
    // Use the I18N to translate the titles using the keys from data.i18n.
    i18n ??= au.container.get(I18N);
    // const root = tr.routeTree.root;
    const child = tr.routeTree.root.children[0];
    return `${i18n.tr(child.data.i18n as string)}`;
  },
}));

// Start application
await au.app(MyApp)
  .start();
