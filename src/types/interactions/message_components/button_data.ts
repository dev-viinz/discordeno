import { ComponentTypes } from "./component_types.ts";

export interface ButtonData {
  /** with the value you defined for this component */
  customId: string;
  /** The type of this component */
  componentType: ComponentTypes.Button;
}
