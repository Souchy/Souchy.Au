import { route } from "@aurelia/router";
import { RouteExtension } from "../../../routes";
import { SettingsSide } from "../../settings-side";

@route({
	path: 'general',
	title: 'General'
})
export class GeneralSettings {
	public static readonly extension: RouteExtension = {
		defaultPage: true,
		viewport: 'settings',
		sidebar: SettingsSide,
	};
}
