import { useEffect } from 'react';

/**
 * @typedef {import("react").React} React
 */

/**
 * @typedef {Object} TimerProps
 * @prop {React.ReactElement} [children=null] The optional children to render
 * @prop {number} delay The number of milliseconds to wait before executing {@link onComplete} after mounting
 * @prop {() => void} onComplete The function to call {@link delay} milliseconds after mounting
 * @prop {AbortSignal} [signal] Optional signal to abort the calling of {@link onComplete}
 */

/**
 * Wrap a component with an effect that has a delayed execution after mounting
 *
 * Useful to co-locate delayed effectful logic with related UI component
 *
 * @param {TimerProps} props
 * @returns {React.ReactElement}
 */
export const Timer = ({ children = null, delay, onComplete = () => {}, signal }) => {
  useEffect(() => {
    const timerId = setTimeout(onComplete, delay);
    const cancel = () => {
      clearTimeout(timerId);
    };
    if (signal) {
      signal.addEventListener('abort', cancel, false);
    }
    return cancel;
  }, []);

  return children;
};
