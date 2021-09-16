function makeIt(arr: string) {
  console.log("hue", arr);
}

const stringed = makeIt.toString();

// const f = new Function(`return ${stringed}`);
// f(
//   "foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
// );

// console.log(f.toString());
// f()("asdf");

function executeFunString(fun: string, ...args: any[]) {
  return new Function(`return ${fun}`)()(...args);
}

console.log(executeFunString(stringed, "asfd"));
