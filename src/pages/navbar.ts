import { resolve, valueConverter } from 'aurelia';
import { INavigationModel, IRouteContext } from '@aurelia/router';

@valueConverter('firstNonEmpty')
class FirstNonEmpty {
  public toView(paths: string[]): string {
    for (const path of paths) {
      if (path) return path;
    }
  }
}

export class NavBar {
  private readonly navModel: INavigationModel = resolve(IRouteContext).routeConfigContext.navigationModel;

  public async binding() {
    await this.navModel.resolve()
  }
}
