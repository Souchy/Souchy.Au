import { route } from "@aurelia/router";
import { RouteExtension } from "../routes";
import { OtherSide } from "./other-side";

export class WelcomePage {
  public static readonly extension: RouteExtension = {
    sidebar: OtherSide,
  };

  public message = 'Welcome to Aurelia 2!';

}
