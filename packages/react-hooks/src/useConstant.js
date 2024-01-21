import { useRef } from 'react';

/**
 * Create a stable reference to a value across component renders
 *
 * When a dynamically generated a value for a component is needed to be stable across the lifetime
 * of the component, `useConstant()` will provide that. For example, generated HTML `id`s, stable
 * function references, etc.
 *
 * ```js
 * const Component = ({ id }) => {
 *   // Same on every render
 *   const htmlId = useConstant(`${id}_${uniqueId()}`);
 * }
 * ```
 *
 * @template {T}
 * @param {T} value The value to set
 * @returns {T} The original {@link value} every time
 */
export const useConstant = value => useRef(value).current;
