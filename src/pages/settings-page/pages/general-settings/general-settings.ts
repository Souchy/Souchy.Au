import { RouteExtension } from "../../../routes";
import { SettingsSide } from "../../settings-side";

export class GeneralSettings {
	public static readonly extension: RouteExtension = {
		defaultPage: true,
		viewport: 'settings',
		sidebar: SettingsSide,
	};
}
