import {
  ExtensionCodec,
  encode,
  decode,
  DecodeError,
  createFernet,
} from "./deps.ts";

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
    if (typeof val !== "string" && typeof val !== "number") {
      throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
    }
    return BigInt(val);
  },
});

export default extensionCodec;

export function encodeData(data: unknown): Uint8Array {
  return encode(data, { extensionCodec });
}

export function decodeData(data: Uint8Array): unknown {
  return decode(data, { extensionCodec });
}

export function createCoders(secret: string) {
  const fernet = createFernet(secret);

  return {
    encode(data: unknown): string {
      return fernet.encode(encode(data, { extensionCodec }));
    },

    decode(data: string): unknown {
      return decode(fernet.decode(data), { extensionCodec });
    },
  };
}

// const coders = createCoders("bz5shaoGZAX6KgWgBARsc3HIOWjSgrGT4KkM7ieTEjc=");

// const enc = coders.encode({ foo: "bar", bigint: 123n });
// const dec = coders.decode(enc);

// console.log({ enc, dec });
