/**
 * @template T
 * @callback CompareFn A comparison function that determines the order of 2 items to each other
 * @param {T} a One value to compare
 * @param {T} b The other value to compare
 * @returns {number} Negative number if {@link a} comes before {@link b}, positive number if {@link b} comes before {@link 1}, or 0 if they should retain their relative position
 */

/**
 * Combine multiple {@link CompareFn} functions to be applied sequentially to attempt to break ties.
 *
 * ```js
 * const compareAge = (a, b) => a.age - b.age;
 *
 * const compareLastName = (a, b) => a.lastName.localeCompare(b.lastName);
 *
 * const sortedPeople = [
 *   {
 *     firstName: 'Bob',
 *     lastName: 'Smith',
 *     age: 23,
 *   },
 *   {
 *     firstName: 'Jane',
 *     lastName: 'Smith',
 *     age: 24,
 *   },
 *   {
 *     firstName: 'Amanda',
 *     lastName: 'Jones',
 *     age: 23,
 *   },
 * ].toSorted(composeCompare(compareLastName, compareAge));
 * console.log(sortedPeople); // Amanda Jones, Bob Smith, Jane Smith
 * ```
 *
 * @template T
 * @param {...CompareFn<T>[]} compareFns One or more comparison functions
 * @returns {CompareFn<T>} A comparison function
 */
export const composeCompare = (...compareFns) =>
  compareFns.length === 0
    ? (_, __) => 0
    : compareFns.length === 1
    ? compareFns[0]
    : (a, b) => compareFns.reduce((result, cmp) => (result !== 0 ? result : cmp(a, b)), 0);

/**
 * @template T
 * @callback EffectFn A function that performs side effects and returns nothing
 * @param {T=void} [arg] Optional argument for each {@link EffectFn} provided
 * @returns {void}
 */

/**
 * Compose effectful functions that accept the same single argument
 *
 * Each function is called in sequence with the same single argument
 *
 * @template T
 * @param {...EffectFn<T=unknown>[]} fns The effectful functions to call in sequence
 * @returns {EffectFn<T=unknown>} An effectful function that accepts a single argument
 */
export const sequence = (...fns) =>
  fns.length === 0
    ? () => {}
    : fns.length === 1
    ? fns[0]
    : x => {
        fns.forEach(f => f(x));
      };

/**
 * @callback Predicate A function that takes a value and returns `true` or `false`, usually to test if a value has some characteristic
 * @param {unknown} value The value to test
 * @returns {boolean} `true` if the value passes the test, `false` otherwise
 */

/**
 * Combine one or more {@link Predicate} functions to create a single {@link Predicate} function
 * where all passed functions must return `true` for the created function to return `true`.
 *
 * @param {...Predicate[]} predFns One or more {@link Predicate} functions
 * @returns {Predicate} A {@link Predicate} function
 */
export const allOf = (...predFns) =>
  predFns.length === 0
    ? _ => true
    : predFns.length === 1
    ? predFns[0]
    : x => predFns.every(p => p(x));

export { allOf as aand };

/**
 * Combine one or more {@link Predicate} functions to create a single {@link Predicate} function
 * where one passed functions must return `true` for the created function to return `true`.
 *
 * @param {...Predicate[]} predFns One or more {@link Predicate} functions
 * @returns {Predicate} A {@link Predicate} function
 */
export const oneOf = (...predFns) =>
  predFns.length === 0
    ? _ => false
    : predFns.length === 1
    ? predFns[0]
    : x => predFns.some(p => p(x));

export { oneOf as oor };

/**
 * @template A
 * @template B
 * @callback MapFn A function that takes a value and returns another value
 * @param {A} a The value to transform
 * @returns {B} The new value
 */

/**
 * Combine multiple {@link MapFn} functions to create a single {@link MapFn} function that takes a
 * value and passes it through each function, from right to left, feeding the returned value to the
 * next function.
 *
 * @param  {...MapFn[]} mapFns One or more functions to combine
 * @returns {MapFn} A function that takes a value and returns the transformed value
 */
export const compose = (...mapFns) =>
  mapFns.length === 0
    ? x => x
    : mapFns.length === 1
    ? mapFns[0]
    : x => mapFns.reduceRight((y, f) => f(y), x);

export { compose as flowRight };
/**
 * Combine multiple {@link MapFn} functions to create a single {@link MapFn} function that takes a
 * value and passes it through each function, from left to right, feeding the returned value to the
 * next function.
 *
 * @param  {...MapFn[]} mapFns One or more functions to combine
 * @returns {MapFn} A function that takes a value and returns the transformed value
 */
export const pipe = (...fns) =>
  mapFns.length === 0
    ? x => x
    : mapFns.length === 1
    ? mapFns[0]
    : x => fns.reduce((y, f) => f(y), x);

export { pipe as flow };
