import { SettingsPage } from './settings-page/settings-page';
import { WelcomePage } from './welcome-page/welcome-page';
import { Demo } from './demo/demo';
import { ComeBack } from './come-back/come-back';
import { AboutPage } from './about-page/about-page';
import { route } from '@aurelia/router';

@route({
  routes: [
    // {
    //   path: ['welcome'],
    //   redirectTo: ''
    // },
    WelcomePage,
    Demo,
    ComeBack,
    SettingsPage,
    AboutPage
  ],
  fallback: import('./missing-page/missing-page'),
})
export class MyApp {
}
