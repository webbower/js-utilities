import React from 'react';

/**
 * @typedef {Object} ErrorBoundaryProps
 * @prop {React.ReactNode | null} [fallback=null] A fallback component to display in an error case
 * @prop {(error: Error, errorInfo: React.ErrorInfo) => void} [onError=() => {}] A callback to invoke when an error is caught
 * @prop {React.ReactNode} children The child component(s) to wrap with the ErrorBoundary
 *
 * @typedef {Object} ErrorBoundaryState
 * @prop {boolean} [hasError=false] Boolean flag for whether or not an error was caught by the ErrorBoundary
 *
 * @typedef {React.Component<ErrorBoundaryProps, ErrorBoundaryState>} ErrorBoundaryComponent
 */

/**
 * General purpose Error Boundary component
 *
 * @see https://legacy.reactjs.org/docs/error-boundaries.html
 *
 * @type {ErrorBoundaryComponent}
 */
export class ErrorBoundary extends React.Component {
  static defaultProps = {
    fallback: null,
    onError: () => {},
  };

  /**
   * <ErrorBoundary> constructor
   *
   * @constructor
   * @this {ErrorBoundaryComponent}
   * @param {ErrorBoundaryProps} props
   */
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  /**
   * @param {Error} error The thrown error
   * @returns {ErrorBoundaryState} The resulting state to update to
   */
  static getDerivedStateFromError(/* error */) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * @this {ErrorBoundaryComponent}
   * @param {Error} error The thrown Error
   * @param {React.ErrorInfo} errorInfo The React error info object
   * @returns {void}
   */
  componentDidCatch(error, errorInfo) {
    console.error('<ErrorBoundary> caught an error:', error.message, errorInfo.componentStack);
    this.props.onError(error, errorInfo);
  }

  /**
   * @this {ErrorBoundaryComponent}
   * @returns {React.ReactNode}
   */
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * TypeScript notes from original version
 *
 * ## Default Prop Type
 *
 * @note With TS, optional props on class components must be defined as required and then have the default value set on
 * `static defaultProps = {...}`
 * @see https://stackoverflow.com/a/37282264
 *
 * ## Constructor Arg Type
 *
 * @note Apparently class component props have to be explicitly redefined in `constructor()` signature
 * @see https://fettblog.eu/typescript-react/components/#constructors
 *
 */
