import { useState } from 'react';

import { useConstant } from './useConstant.js';

/**
 * @template {T extends Object}
 * @typedef {Object} ObjectStateHookApi
 * @prop {(newState: T) => void} set Change the state to {@link newState}
 * @prop {() => void} reset Change the state to the initial value
 * @prop {(fieldName: keyof T, newValue: T[keyof T]) => void} setField
 * @prop {(newPartialState: Partial<T>) => void} update
 */

/**
 * Custom hook that wraps {@link useState} and provides better state updater primitive functions for
 * dealing with POJO state.
 *
 * @todo Create `useModelState(inst)` where `api.update()` internally calls `inst.update()`
 */
export const useObjectState = (initialState = {}) => {
  const [state, setState] = useState(initialState);
  const api = useConstant({
    /**
     * Overwrite the whole state. This is the default state setter.
     */
    set: setState,
    /**
     * Reset the state to the first `initialState`
     *
     * @note This will be the first initialState because `useConstant()` for the API captures the
     * first value in this function definition closure.
     */
    reset: () => {
      setState(initialState);
    },
    /**
     * Set a single field to a specific value
     */
    setField: (fieldName, fieldValue) => {
      setState(current => ({
        ...current,
        [fieldName]: fieldValue,
      }));
    },
    /**
     * Update only the fields provided in the argument
     */
    update: newPartialState => {
      setState(current => ({
        ...current,
        ...newPartialState,
      }));
    },
  });

  return [state, api];
};
