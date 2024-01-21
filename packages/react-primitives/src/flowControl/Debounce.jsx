import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

import { useEffectOnMounted, useConstant } from '@webbower/react-hooks';

/**
 * @typedef {import("react").React} React
 *
 * @typedef {import("@types/lodash").debounce} DebounceFn
 */

/**
 * @typedef {Object} DebounceProps
 * @prop {number} delay The debounce delay in milliseconds
 * @prop {React.ReactElement} children The children to render
 * @prop {DebounceFn} [debounceFn] A custom implementation of a debounce function to override the defaults Lodash version
 */

/**
 * Render a component where the re-render is debounced
 *
 * After the initial render, {@link DebounceProps.delay} milliseconds must elapse since the previous
 * render update attempt before it will render the latest updates.
 *
 * @param {DebounceProps} props
 * @returns {React.ReactElement}
 */
export const Debounce = ({ children, delay, debounceFn = debounce }) => {
  // Initialize ref to hold next content to render
  const nextChildren = useRef();

  // Store the most recent children on every render in the ref so that it doesn't trigger re-render
  nextChildren.current = children;

  // Initialize state that holds actually rendered content
  const [renderedChildren, setRenderedChildren] = useState(nextChildren.current);

  // Create stable function reference for debounced state setter
  const debouncedSetRenderedChildren = useConstant(debounceFn(setRenderedChildren, delay));

  useEffect(() => {
    // On each render pass, if the next children is different than the currently rendered children, call debounced state updater
    if (nextChildren.current !== renderedChildren) {
      debouncedSetRenderedChildren(nextChildren.current);
    }
  });

  // Cleaning up the setTimeout timers on component unmount
  useEffectOnMounted(() => debouncedSetRenderedChildren.cleanup);

  // Render children from state
  return renderedChildren;
};
