import { ButtonStyles } from "./buton_styles.ts";
import { ComponentTypes } from "./component_types.ts";

/**
 * https://discord.com/developers/docs/interactions/message-components#component-object-component-structure
 */
export type Component = ButtonComponent | SelectMenuComponent;

export type ButtonComponent = LinkButtonComponent | BaseButtonComponent;

interface BaseButtonComponent {
  /** [Component Type](https://discord.com/developers/docs/interactions/message-components#component-object-component-types). */
  type: ComponentTypes.Button;
  /** A developer-defined identifier for the component, max 100 characters. */
  customId: string;
  /** Whether the component is disabled, default `false`. */
  disabled?: boolean;
  /** One of [Button Styles](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles). */
  style: ButtonStyles;
  /** Text that appears on the button, max 80 characters. */
  label: string;
  /** `name`, `id` and `animated`. */
  emoji?: {
    name: string;
    id?: bigint;
    animated?: boolean;
  };
}

interface LinkButtonComponent extends Omit<BaseButtonComponent, "customId"> {
  /** One of [Button Styles](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles). */
  style: ButtonStyles.Link;
  /** A url for link-style buttons. */
  url: string;
}

export interface SelectMenuComponent {
  /** [Component Type](https://discord.com/developers/docs/interactions/message-components#component-object-component-types). */
  type: ComponentTypes.SelectMenu;
  /** A developer-defined identifier for the component, max 100 characters. */
  customId: string;
  /** The choices in the select, max 25. */
  options: SelectOption[];
  /** Custom placehollder text if nothing is selected, max 100 characters. */
  placeholder?: string;
  /** The minimum number of items that must be chosen; default 1, min 0, max 25. */
  minValues?: number;
  /** The maximum number of items that can be chosen; default 1, max 25. */
  maxValues?: number;
  /** Whether the component is disabled, default `false`. */
  disabled?: boolean;
}

export interface SelectOption {
  /** The user-facing name of the option. Maximum 25 characters. */
  label: string;
  /** The dev-defined value of the option. Maximum 100 characters. */
  value: string;
  /** An additional description of the option. Maximum 50 characters. */
  description?: string;
  // TODO: make this type better based on what you have done for components util class.
  /** `name`, `id` and `animated`. */
  emoji?:
    | {
      id: bigint;
      name: string;
      animated?: boolean;
    }
    | {
      name: string;
    };
  /** Will render this option as already-selected by default. */
  default?: boolean;
}

/**
 * https://discord.com/developers/docs/interactions/message-components#action-rows
 */
export interface ActionRow {
  /** Action rows are a group of buttons. */
  type: ComponentTypes.ActionRow;
  /** The components in this row. */
  components: Component[];
}
