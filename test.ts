type RAPick<
  T,
  K extends readonly (keyof T)[] | undefined
> = K extends readonly (keyof T)[] ? { [P in K[number]]: T[P] } : T;

type ValueOf<T> = T[keyof T];

interface O {
  bar: readonly (keyof F)[];
}

interface F {
  a: string;
  b: number;
  c: boolean;
}

function foo<P extends Partial<O> = Partial<O>>(picks?: Partial<P>) {
  type getType<T extends keyof O> = P extends O
    ? P[T] extends O[T]
      ? RAPick<F, P[T]>
      : F
    : F;

  return {
    foo: "bar",
    bar: (): getType<"bar"> => {
      const data = { a: "ok", b: 2, c: false };

      const res = {};

      for (const [name, entry] of Object.entries(data)) {
        if (picks?.bar && !picks.bar.includes(name)) continue;
        res[name] = entry;
      }

      return res;
    },
    start() {
      console.log(this.bar());
    },
  };
}

// const ree = foo({ bar: ["b", "c"] as const });
const ree = foo();

console.log(ree.bar());

// function overwriter() {
//   const gen = foo();
//   gen.bar = () => "okok";

//   return gen;
// }

// const ree = overwriter();

// const omits = ["b"] as const;

// type R = Omit<F, typeof omits[number]>;
