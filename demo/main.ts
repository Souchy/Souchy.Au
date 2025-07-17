import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';
import { MyApp } from './my-app';
// import { ModalTargetCustomAttribute } from '../src/ui/components/modal/modal-target';
// import { Splitgrid } from '../src/ui/components/splitgrid/splitgrid';
// import { Modal } from '../src/ui/components/modal/modal';
// import { ModalTargetCustomAttribute, Splitgrid, Modal } from 'souchy.au';
import { ModalTargetCustomAttribute, Splitgrid, Modal } from '../src';

Aurelia
  .register(RouterConfiguration)
  // To use HTML5 pushState routes, replace previous line with the following
  // customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .register(ModalTargetCustomAttribute)
  .register(Splitgrid, Modal)
  .app(MyApp)
  .start();
