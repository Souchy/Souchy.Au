import { bindable } from "aurelia";

export class WelcomeSide {

	@bindable text: string = "Welcome to Souchy.Au!";
	
	constructor() {
		// console.log("WelcomeSide component ctor.");
	}

	public attached(): void {
		// console.log("WelcomeSide component attached.");
	}

	public binding(): void {
		// console.log("WelcomeSide component binding.");
	}

}
