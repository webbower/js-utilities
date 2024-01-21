/**
 * @typedef {import('react').ReactComponent} ReactComponent
 */

/**
 * Get the display name of a React component
 *
 * @param {ReactComponent|string} Component A React component or string native component name
 * @return {string} The name of the component or empty string if no component is passed
 */
const UNKNOWN_COMPONENT_NAME = 'UnknownComponent';
export const getComponentName = Component => {
  // Handle missing data cases
  if (Component == null || Component === '') {
    return UNKNOWN_COMPONENT_NAME;
  }

  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || UNKNOWN_COMPONENT_NAME;
};

/**
 * Create a wrapped component name for use with HOCs
 *
 * @param {ReactComponent|string} BaseComponent The component to be wrapped
 * @param {ReactComponent|string} HocComponent The name of the wrapping component
 * @return {string} A wrapped name generated from the 2 component names
 */
export const wrapComponentName = (BaseComponent, HocComponent) =>
  `${getComponentName(HocComponent)}(${getComponentName(BaseComponent)})`;
