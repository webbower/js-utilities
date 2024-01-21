import React from 'react';

import { render } from '@testing-library/react';

import { ErrorBoundary } from './ErrorBoundary.js';

/**
 * @typedef {import("./ErrorBoundary.js").ErrorBoundaryProps} ErrorBoundaryProps
 *
 * @typedef {import("@testing-library/react").RenderResult} RenderResult
 */

/**
 * @param {Partial<ErrorBoundaryProps>} [config] Props and other config for rendering a test instance
 * @returns {RenderResult} The test result API from RTL {@link render}
 */
const renderTestComponent = ({ fallback, onError, children = <div>Error</div> } = {}) =>
  render(
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );

const validText = 'Hello World!';
const fallbackText = 'ERROR!';

const ValidComponent = () => <div>{validText}</div>;

const ErrorComponent = () => {
  throw new Error('Oh no!');

  return <div>Never gonna see me</div>;
};

describe('<ErrorBoundary>', () => {
  it('should display the `children` when no error is triggered', () => {
    const { queryByText } = renderTestComponent({
      fallback: <div>{fallbackText}</div>,
      children: <ValidComponent />,
    });

    expect(queryByText(validText)).toBeInTheDocument();
    expect(queryByText(fallbackText)).not.toBeInTheDocument();
  });

  it('should display the `fallback` when an error is triggered', () => {
    const { queryByText } = renderTestComponent({
      fallback: <div>{fallbackText}</div>,
      children: <ErrorComponent />,
    });

    expect(queryByText(validText)).not.toBeInTheDocument();
    expect(queryByText(fallbackText)).toBeInTheDocument();
  });

  it('should call `onError` with Error and ErrorInfo when an error is triggered', () => {
    const onErrorSpy = jest.fn();
    renderTestComponent({ onError: onErrorSpy, children: <ErrorComponent /> });

    expect(onErrorSpy.mock.calls.length).toStrictEqual(1);
    expect(onErrorSpy.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onErrorSpy.mock.calls[0][1]).toHaveProperty('componentStack');
  });
});
