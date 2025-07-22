import { routesByViewport } from "../routes";

export class SettingsSide {

  public get routes() {
	console.log("SettingsSide routes: ", routesByViewport.get('settings'));
	return routesByViewport.get('settings') || []; //foundRoutes;
  }

}
