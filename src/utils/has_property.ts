// Typescript is not so good as we developers so we need this little utility function to help it out
// Taken from https://fettblog.eu/typescript-hasownproperty/
/** TS save way to check if a property exists in an object */
export function hasProperty<
  // deno-lint-ignore ban-types
  T extends {},
  Y extends PropertyKey = string,
>(obj: T, prop: Y): obj is T & Record<Y, unknown> {
  // deno-lint-ignore no-prototype-builtins
  return obj.hasOwnProperty(prop);
}

export default hasProperty;
