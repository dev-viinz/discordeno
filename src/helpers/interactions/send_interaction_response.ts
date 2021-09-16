import { Bot } from "../../bot.ts";
import { Snowflake } from "../../types/base.ts";
import { Message } from "../../types/channel/messages/message.ts";
import { InteractionResponse } from "../../types/interactions/interaction_response.ts";
import { endpoints } from "../../utils/constants.ts";

export async function sendInteractionResponse(
  bot: Bot,
  id: Snowflake,
  token: string,
  options: InteractionResponse
): Promise<undefined | Message> {
  // TODO: add more options validations
  // if (options.data?.components) validateComponents(options.data?.components);

  // If no mentions are provided, force disable mentions
  if (!options.data?.allowedMentions) {
    options.data = { ...options.data, allowedMentions: { parse: [] } };
  }

  // If its already been executed, we need to send a followup response
  if (bot.cache.executedSlashCommands.has(id)) {
    return await bot.fetch(
      "POST",
      endpoints.WEBHOOK(bot.applicationId, token),
      options.data,
      bot.transformers.transformMessage
    );
  }

  // TODO: sweeper for this
  // Expire in 15 minutes
  bot.cache.executedSlashCommands.add(id);

  return await bot.fetch(
    "POST",
    endpoints.INTERACTION_ID_TOKEN(id, token),
    options
  );
}
