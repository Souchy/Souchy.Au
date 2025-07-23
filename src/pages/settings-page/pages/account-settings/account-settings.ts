import { route } from "@aurelia/router";
import { SettingsSide } from "../../settings-side";

@route({
	id: 'settings/account',
	path: 'account',
	title: 'Account',
	data: {
		// i18n: 'routes.account'
		sidebar: SettingsSide
	}
})
export class AccountSettings {
}
