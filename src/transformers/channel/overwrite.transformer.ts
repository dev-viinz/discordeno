import { Overwrite } from "../../types/channel/overwrite.ts";
import { ToDiscordType } from "../../types/utils.ts";

export function transformOverwrite(
  overwrite: ToDiscordType<Overwrite>,
): Overwrite {
  return {
    id: BigInt(overwrite.id),
    type: overwrite.type,
    allow: BigInt(overwrite.allow),
    deny: BigInt(overwrite.deny),
  };
}

export default transformOverwrite;
