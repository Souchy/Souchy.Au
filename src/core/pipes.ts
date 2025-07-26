import { valueConverter } from "aurelia";

@valueConverter('firstNonEmpty')
export class FirstNonEmpty {
	public toView(paths: string[]): string {
		for (const path of paths) {
			if (path) return path;
		}
	}
}
