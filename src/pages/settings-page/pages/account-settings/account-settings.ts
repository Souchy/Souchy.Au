import { route } from "@aurelia/router";
import { RouteExtension } from "../../../routes";
import { SettingsSide } from "../../settings-side";

@route({
	path: 'account',
	title: 'Account'
})
export class AccountSettings {
	public static readonly extension: RouteExtension = {
		viewport: 'settings',
		sidebar: SettingsSide,
	};
}
