import { Snowflake } from "../types/base.ts";

/** Deconstructs (melts) a Snowflake and returns its information */
export function meltSnowflake(snowflake: Snowflake) {
  return {
    timestamp: snowlakeToUnix(snowflake),
    workerId: (snowflake & 0x3e0000n) >> 17n,
    processId: (snowflake & 0x1f000n) >> 12n,
    increment: snowflake & 0xfffn,
  };
}

// Providing an externnal function since this is used often
/** Convert a Snowflake to a UNIX timestamp */
export function snowlakeToUnix(snowflake: Snowflake) {
  return (snowflake >> 22n) + 1420070400000n;
}
