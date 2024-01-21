import { useEffect } from 'react';

/**
 * Perform an effect when a component mounts and optionally an effect when the component unmounts
 *
 * A thin wrapper around the {@link useEffect} to explicitly label the intended scope of the effect.
 * Equivalent to:
 *
 * ```js
 * useEffect(() => { ... }, []);
 * ```
 *
 * @param {() => (() => void | void)} cb The function to call after the component mounts, optionally
 *   returning a function to call when the component unmounts.
 * @returns {void}
 */
export const useEffectOnMounted = cb => {
  useEffect(cb, []);
};
