// import {
//   encode,
//   decode,
//   DecodeError,
//   ExtensionCodec,
// } from "https://esm.sh/@msgpack/msgpack/mod.ts";

// export class Collection<K, V> {
//   maxSize?: number;
//   private storage: Map<K, Uint8Array>;

//   constructor(
//     entries?: (readonly (readonly [K, V])[] | null) | Map<K, V>,
//     options?: CollectionOptions
//   ) {
//     this.storage = new Map();

//     if (entries instanceof Map) {
//       entries = [...entries.entries()];
//     }

//     entries?.map((entry) => this.storage.set(entry[0], encodeData(entry[1])));

//     this.maxSize = options?.maxSize;
//   }

//   get size(): number {
//     return this.storage.size;
//   }

//   clear(): void {
//     return this.storage.clear();
//   }

//   delete(key: K): boolean {
//     return this.storage.delete(key);
//   }

//   get(key: K): V {
//     return decodeData(this.storage.get(key));
//   }

//   has(key: K): boolean {
//     return this.storage.has(key);
//   }

//   keys(): IterableIterator<K> {
//     return this.storage.keys();
//   }

//   // TODO: values
//   // TODO: entries

//   set(key: K, value: V): boolean {
//     // When this collection is maxSizeed make sure we can add first
//     if ((this.maxSize || this.maxSize === 0) && this.size >= this.maxSize) {
//       return false;
//     }

//     this.storage.set(key, encodeData(value));
//     return true;
//   }

//   array(): V[] {
//     return [...this.storage.values()].map((value) => decodeData(value));
//   }

//   /** Retrieve the value of the first element in this collection */
//   first(): V | undefined {
//     return decodeData(this.storage.values().next().value);
//   }

//   last(): V | undefined {
//     return decodeData([...this.storage.values()][this.size - 1]);
//   }

//   random(): V | undefined {
//     const array = [...this.storage.values()];
//     return decodeData(array[Math.floor(Math.random() * array.length)]);
//   }

//   find(callback: (value: V, key: K) => boolean): V | undefined {
//     for (const key of this.storage.keys()) {
//       const value = this.get(key)!;
//       if (callback(value, key)) return value;
//     }
//     // If nothing matched
//     return;
//   }

//   forEach(callback: (value: V, key: K) => void): void {
//     return this.storage.forEach((v, k) => callback(decodeData(v), k));
//   }

//   filter(callback: (value: V, key: K) => boolean): Collection<K, V> {
//     const relevant = new Collection<K, V>();
//     this.forEach((value, key) => {
//       if (callback(value, key)) relevant.set(key, value);
//     });

//     return relevant;
//   }

//   map<T>(callback: (value: V, key: K) => T): T[] {
//     const results = [];
//     for (const key of this.storage.keys()) {
//       const value = this.get(key)!;
//       results.push(callback(value, key));
//     }
//     return results;
//   }

//   some(callback: (value: V, key: K) => boolean): boolean {
//     for (const key of this.storage.keys()) {
//       const value = this.get(key)!;
//       if (callback(value, key)) return true;
//     }

//     return false;
//   }

//   every(callback: (value: V, key: K) => boolean): boolean {
//     for (const key of this.storage.keys()) {
//       const value = this.get(key)!;
//       if (!callback(value, key)) return false;
//     }

//     return true;
//   }

//   reduce<T>(
//     callback: (accumulator: T, value: V, key: K) => T,
//     initialValue?: T
//   ): T {
//     let accumulator: T = initialValue!;

//     for (const key of this.storage.keys()) {
//       const value = this.get(key)!;
//       accumulator = callback(accumulator, value, key);
//     }

//     return accumulator;
//   }
// }

// interface CollectionOptions {
//   maxSize?: number;
// }

// const extensionCodec = new ExtensionCodec();
// extensionCodec.register({
//   type: 0,
//   encode: (input: unknown) => {
//     if (typeof input === "bigint") {
//       if (
//         input <= Number.MAX_SAFE_INTEGER &&
//         input >= Number.MIN_SAFE_INTEGER
//       ) {
//         return encode(parseInt(input.toString(), 10));
//       } else {
//         return encode(input.toString());
//       }
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     const val = decode(data);
//     if (!(typeof val === "string" || typeof val === "number")) {
//       throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
//     }
//     return BigInt(val);
//   },
// });

// extensionCodec.register({
//   type: 1,
//   encode: (input: unknown) => {
//     if (input instanceof Collection) {
//       return encode(
//         input.map((value, index) => [index, value]),
//         { extensionCodec }
//       );
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     const val = decode(data, { extensionCodec });
//     if (!(typeof val === "object")) {
//       throw new DecodeError(
//         `unexpected Collection source: ${val} (${typeof val})`
//       );
//     }
//     return new Collection(val);
//   },
// });

// function encodeData(data: any): Uint8Array {
//   return encode(data, { extensionCodec });
// }

// function decodeData(data?: Uint8Array) {
//   if (!data) return data;
//   return decode(data, { extensionCodec });
// }
export class Collection<K, V> extends Map<K, V> {
  maxSize?: number;

  constructor(
    entries?: (readonly (readonly [K, V])[] | null) | Map<K, V>,
    options?: CollectionOptions<K, V>
  ) {
    super(entries ?? []);

    this.maxSize = options?.maxSize;
  }

  // @ts-ignore
  set(key: K, value: V): boolean {
    // When this collection is maxSizeed make sure we can add first
    if ((this.maxSize || this.maxSize === 0) && this.size >= this.maxSize) {
      return false;
    }

    super.set(key, value);
    return true;
  }

  array() {
    return [...this.values()];
  }

  /** Retrieve the value of the first element in this collection */
  first(): V | undefined {
    return this.values().next().value;
  }

  last(): V | undefined {
    return [...this.values()][this.size - 1];
  }

  random(): V | undefined {
    const array = [...this.values()];
    return array[Math.floor(Math.random() * array.length)];
  }

  find(callback: (value: V, key: K) => boolean) {
    for (const key of this.keys()) {
      const value = this.get(key)!;
      if (callback(value, key)) return value;
    }
    // If nothing matched
    return;
  }

  filter(callback: (value: V, key: K) => boolean) {
    const relevant = new Collection<K, V>();
    this.forEach((value, key) => {
      if (callback(value, key)) relevant.set(key, value);
    });

    return relevant;
  }

  map<T>(callback: (value: V, key: K) => T) {
    const results = [];
    for (const key of this.keys()) {
      const value = this.get(key)!;
      results.push(callback(value, key));
    }
    return results;
  }

  some(callback: (value: V, key: K) => boolean) {
    for (const key of this.keys()) {
      const value = this.get(key)!;
      if (callback(value, key)) return true;
    }

    return false;
  }

  every(callback: (value: V, key: K) => boolean) {
    for (const key of this.keys()) {
      const value = this.get(key)!;
      if (!callback(value, key)) return false;
    }

    return true;
  }

  reduce<T>(
    callback: (accumulator: T, value: V, key: K) => T,
    initialValue?: T
  ): T {
    let accumulator: T = initialValue!;

    for (const key of this.keys()) {
      const value = this.get(key)!;
      accumulator = callback(accumulator, value, key);
    }

    return accumulator;
  }
}

interface CollectionOptions<K, V> {
  maxSize?: number;
}
