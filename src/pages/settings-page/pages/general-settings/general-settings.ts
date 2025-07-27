import { route } from "@aurelia/router";
import { SettingsSide } from "../../settings-side";
import { GeneralSidebar } from "./general-sidebar";


@route({
	id: 'settings/general',
	path: ['', 'general'],
	title: 'General',
	data: {
		i18n: 'routes:settings.general',
		parent: 'settings',
		sidebar: GeneralSidebar
	}
})
export class GeneralSettings {
}
