export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
