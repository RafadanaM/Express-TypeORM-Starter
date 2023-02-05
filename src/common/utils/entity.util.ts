/*
  RANT

  Getting specific properties of an object was easy, but damn, getting
  the typing right was frustrating (I'm probably just bad). I want the
  function's argument to be the possible keys of Object T and have a return
  type of the picked Object's properties. I ended up with "keyof T" as the
  function's parameter type. That was a bad move, the function always
  returns all of Object T's properties instead of only the ones that are
  picked. The missing piece was "U extends keyof T". This allows U to be
  constrained to the keys of Object T and it can also be as big as T but
  it can also be specific properties of T which is what I want.

  https://stackoverflow.com/questions/53099089/difference-between-of-k-extends-keyof-t-vs-directly-using-keyof-t
  https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints

*/

function select<T extends object, U extends keyof T>(obj: T, ...keys: U[]): Pick<T, U> {
  return keys.reduce((acc, curr) => ({ ...acc, [curr]: obj[curr] }), {} as Pick<T, U>);
}

function remove<T extends object, U extends keyof T>(obj: T, ...keys: U[]): Omit<T, U> {
  const keysSet = new Set(keys);

  // I want to use entries but I dont wanna deal with more type stuff
  const objKeys = Object.keys(obj) as U[];
  return objKeys.reduce((acc, curr) => (keysSet.has(curr) ? acc : { ...acc, [curr]: obj[curr] }), {} as Omit<T, U>);
}

export { select, remove };
