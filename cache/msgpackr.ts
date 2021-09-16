import { decode, DecodeError, encode, ExtensionCodec } from "./deps.ts";

export const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: 0,
  encode: (input: unknown) => {
    if (typeof input === "bigint") {
      if (
        input <= Number.MAX_SAFE_INTEGER &&
        input >= Number.MIN_SAFE_INTEGER
      ) {
        return encode(parseInt(input.toString(), 10));
      } else {
        return encode(input.toString());
      }
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const val = decode(data);
    if (!(typeof val === "string" || typeof val === "number")) {
      throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
    }
    return BigInt(val);
  },
});

export default extensionCodec;

// deno-lint-ignore no-explicit-any
export function encodeData(data: any): Uint8Array {
  return encode(data, { extensionCodec });
}

export function decodeData(data: Uint8Array) {
  return decode(data, { extensionCodec });
}
