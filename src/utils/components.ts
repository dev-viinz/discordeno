import { ButtonStyles } from "../types/interactions/message_components/buton_styles.ts";
import {
  ActionRow,
  ButtonComponent,
  SelectOption,
} from "../types/interactions/message_components/component.ts";
import { ComponentTypes } from "../types/interactions/message_components/component_types.ts";
import { SNOWFLAKE_REGEX } from "./constants.ts";

export class Components extends Array<ActionRow> {
  constructor(...args: ActionRow[]) {
    super(...args);

    return this;
  }

  addActionRow() {
    // Don't allow more than 5 Action Rows
    if (this.length === 5) return this;

    this.push({
      type: 1,
      components: ([] as unknown) as ActionRow["components"],
    });
    return this;
  }

  addSelectMenu(
    placeholder: string,
    customId: string,
    selectOptions: SelectOption[],
    options?: { minValues?: number; maxValues?: number },
  ) {
    // No Action Row has been created so do it
    if (!this.length) this.addActionRow();

    // Get the last Action Row
    let row = this[this.length - 1];

    // If the Action Row already has something create a new one
    if (row.components.length >= 1) {
      this.addActionRow();
      row = this[this.length - 1];

      // Apperandly there are already 5 Full Action Rows so don't add the button
      if (row.components.length >= 1) return this;
    }

    row.components.push({
      type: ComponentTypes.SelectMenu,
      customId,
      options: selectOptions,
      placeholder,
      minValues: options?.minValues,
      maxValues: options?.maxValues,
    });

    return this;
  }

  addButton(
    label: string,
    style: keyof typeof ButtonStyles,
    customIdOrLink: string,
    options?: {
      emoji?: string | { name: string; id?: bigint; animated?: boolean };
      disabled?: boolean;
    },
  ) {
    // No Action Row has been created so do it
    if (!this.length) this.addActionRow();

    // Get the last Action Row
    let row = this[this.length - 1];

    // If the Action Row already has 5 buttons create a new one
    if (
      row.components.length === 5 ||
      row.components[0]?.type === ComponentTypes.SelectMenu
    ) {
      this.addActionRow();
      row = this[this.length - 1];

      // Apperandly there are already 5 Full Action Rows so don't add the button
      if (
        row.components.length === 5 ||
        row.components[0]?.type === ComponentTypes.SelectMenu
      ) {
        return this;
      }
    }

    row.components.push({
      type: ComponentTypes.Button,
      label: label,
      customId: style !== "Link" ? customIdOrLink : undefined,
      style: ButtonStyles[style],
      emoji: this.#stringToEmoji(options?.emoji),
      url: style === "Link" ? customIdOrLink : undefined,
      disabled: options?.disabled,
    } as ButtonComponent);

    return this;
  }

  #stringToEmoji(
    emoji?: string | { name: string; id?: bigint; animated?: boolean },
  ): { name: string; id?: bigint; animated?: boolean } | undefined {
    if (typeof emoji !== "string") return emoji;

    emoji = emoji.toString();

    // A snowflake id was provided
    if (/^<a?:(\w+):(\d+)>$/.test(emoji)) {
      const animated = emoji.startsWith("<a:");
      const name = emoji.substring(
        emoji.indexOf(":") + 1,
        emoji.lastIndexOf(":"),
      );
      const id = emoji.match(SNOWFLAKE_REGEX)![0];

      return {
        name,
        id: BigInt(id),
        animated,
      };
    }

    // A unicode emoji was provided
    return {
      name: emoji,
    };
  }
}
