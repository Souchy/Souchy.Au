import Aurelia, { AppTask, IEventAggregator } from 'aurelia';
import { IRouter, RouterConfiguration, Transition } from '@aurelia/router';
import { MyApp } from './my-app';
import * as SouchyAu from '../index';
import { I18nConfiguration } from '@aurelia/i18n';
import Fetch from 'i18next-fetch-backend';
import { FirstNonEmpty } from '../core/pipes';

Aurelia
  .register(SouchyAu)
  .register(
    I18nConfiguration.customize((options) => {
      options.initOptions = {
        plugins: [Fetch],
        backend: {
          loadPath: './i18n/{{lng}}/{{ns}}.json',
        },
        // defaultNS: 'routes'
        ns: ['routes', 'common'],
        lng: 'fr',
      };
    }),
  )
  .register(RouterConfiguration.customize({
    useNavigationModel: true,
    useUrlFragmentHash: false,
    activeClass: "toggled",
  }))
  .register(FirstNonEmpty)
  .app(MyApp)
  .start();
