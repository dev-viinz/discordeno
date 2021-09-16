import { User } from "../../types/user/user.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { iconHashToBigInt } from "../../utils/hash.ts";

export function transformUser(user: ToDiscordType<User>): User {
  return {
    id: BigInt(user.id),
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar ? iconHashToBigInt(user.avatar) : null,
    bot: user.bot,
    system: user.system,
    mfaEnabled: user.mfa_enabled,
    locale: user.locale,
    verified: user.verified,
    email: user.email,
    flags: user.flags,
    premiumType: user.premium_type,
    publicFlags: user.public_flags,
  };
}

export default transformUser;
