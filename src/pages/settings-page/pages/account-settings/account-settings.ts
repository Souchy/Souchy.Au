import { RouteExtension } from "../../../routes";
import { SettingsSide } from "../../settings-side";

export class AccountSettings {
	public static readonly extension: RouteExtension = {
		viewport: 'settings',
		sidebar: SettingsSide,
	};
}
