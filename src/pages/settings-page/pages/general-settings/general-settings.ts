import { route } from "@aurelia/router";
import { SettingsSide } from "../../settings-side";


@route({
	id: 'settings/general',
	path: ['', 'general'],
	title: 'General',
	data: {
		i18n: 'routes:settings.general',
		parent: 'settings',
		sidebar: SettingsSide
	}
})
export class GeneralSettings {
}
