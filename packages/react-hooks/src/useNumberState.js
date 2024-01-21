import { useState } from 'react';
import { useConstant } from './useConstant.js';

/**
 * @typedef {Object} NumberStateHookApi
 * @prop {(newState: number) => void} set Change the state to {@link newState}
 * @prop {() => void} reset Change the state to the initial value
 * @prop {(delta = 1) => void} inc Increase the state value by {@link delta}, defaults to 1
 * @prop {(decValue = 1) => void} dec Decrease the state value by {@link devValue}, defaults to 1
 * @prop {() => void} neg Change the value from negative to positive or positive to negative. No effect on 0.
 */

/**
 * React state hook specialized to work with boolean values
 *
 * ```jsx
 * const Counter = () => {
 *   const [value, { inc, dec, reset: resetCounter }] = useBooleanState();
 *
 *   const handleIncrementClick = () => {
 *     inc();
 *   };
 *
 *   const handleDecrementClick = () => {
 *     dec();
 *   };
 *
 *   const handleResetClick = () => {
 *     resetCounter();
 *   };
 *
 *   return (
 *     <div>
 *       <button type="button" onClick={handleIncrementClick}>Decrement</button>
 *       <button type="button" onClick={handleDecrementClick}>Increment</button>
 *       <button type="button" onClick={handleResetClick}>Reset</button>
 *       <p>Current value is: {value}</p>
 *     </div>
 *   );
 * };
 * ```
 *
 * @todo Add guards for out-of-bounds numbers for init and API functions
 *
 * @param {number} [initialState=0] The initial state
 * @returns {[number, NumberStateHookApi]} A tuple of the current state value and the hook API
 */
export const useNumberState = (initialState = 0) => {
  if (Number.isNaN(initialState) || initialState === Infinity || initialState === -Infinity) {
    throw new TypeError(
      'useNumberState(): Initial value cannot be NaN, positive Infinity, or Negative Infinity'
    );
  }

  const [state, setState] = useState(initialState);
  const api = useConstant({
    set: setState,
    /**
     * @note This will be the first initialState because `useConstant()` for the API captures the
     * first value in this function definition closure.
     */
    reset: () => {
      setState(initialState);
    },
    inc: (incValue = 1) => {
      setState(current => current + incValue);
    },
    dec: () => {
      setState(current => current + incValue);
    },
    neg: () => {
      setState(current => (current !== 0 ? -current : current));
    },
  });

  return [state, api];
};
