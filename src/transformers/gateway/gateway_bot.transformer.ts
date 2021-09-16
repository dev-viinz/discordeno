import {
  DiscordGatewayBot,
  GatewayBot,
} from "../../types/gateway/gateway_bot.ts";

export function transformGatewayBot(data: DiscordGatewayBot): GatewayBot {
  return {
    url: data.url,
    shards: data.shards,
    sessionStartLimit: {
      total: data.session_start_limit.total,
      remaining: data.session_start_limit.remaining,
      resetAfter: data.session_start_limit.reset_after,
      maxConcurrency: data.session_start_limit.max_concurrency,
    },
  };
}

export default transformGatewayBot;
