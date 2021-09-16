function toSnakeCase(string: string) {
  return string
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
}

function isConvertableObject(obj: unknown): obj is Record<string, unknown> {
  return (
    // CHECK IF THE OBJECT IS AN OBJECT AND NOT NULL
    obj === Object(obj) &&
    // ARRAYS CANNOT BE CONVERTED
    !Array.isArray(obj) &&
    // FUNCTIONS CANNOT BE CONVERTED
    typeof obj !== "function" &&
    // BLOBS CANNOT BE CONVERTED
    !(obj instanceof Blob)
  );
}

export function toDiscordBody<T>(
  obj: // deno-lint-ignore no-explicit-any
  | Record<string, any>
    // deno-lint-ignore no-explicit-any
    | Record<string, any>[]
    | bigint
    | string
    | number
    | boolean
): T {
  if (isConvertableObject(obj)) {
    // deno-lint-ignore no-explicit-any
    const convertedObject: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      convertedObject[toSnakeCase(key)] = toDiscordBody(value);
    }

    return convertedObject as T;
  } else if (Array.isArray(obj)) {
    obj = obj.map((element) => toDiscordBody(element));
  }

  return typeof obj === "bigint"
    ? ((obj.toString() as unknown) as T)
    : (obj as T);
}
