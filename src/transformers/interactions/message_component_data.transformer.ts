import { ButtonData } from "../../types/interactions/message_components/button_data.ts";
import { ComponentTypes } from "../../types/interactions/message_components/component_types.ts";
import { SelectMenuData } from "../../types/interactions/message_components/select_menu_data.ts";
import { ToDiscordType } from "../../types/utils.ts";

export function transformMessageComponentData(
  data: ToDiscordType<ButtonData | SelectMenuData>
): ButtonData | SelectMenuData {
  switch (data.component_type) {
    case ComponentTypes.SelectMenu:
      return {
        componentType: data.component_type,
        customId: data.custom_id,
        values: data.values,
      };
    case ComponentTypes.Button:
      return {
        componentType: data.component_type,
        customId: data.custom_id,
      };
  }
}

export default transformMessageComponentData;
