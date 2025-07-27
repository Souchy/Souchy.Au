import { route } from "@aurelia/router";
import { SettingsSide } from "../../settings-side";

@route({
	id: 'settings/account',
	path: ['account'],
	title: 'Account',
	data: {
		i18n: 'routes:settings.account',
		parent: 'settings',
		// sidebar: SettingsSide
	}
})
export class AccountSettings {
}
