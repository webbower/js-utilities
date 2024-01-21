import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Debounce } from './Debounce';

/**
 * @typedef {import("./Debounce.js").DebounceProps} DebounceProps
 *
 * @typedef {import("@testing-library/react").RenderResult} RenderResult
 */

/**
 * @param {Partial<ErrorBoundaryProps>} config Props and other config for rendering a test instance
 * @returns {RenderResult} The test result API from RTL {@link render}
 */
const renderTestComponent = ({ delay = 250, children = <p>test</p>, debounceFn }) =>
  render(
    <Debounce delay={delay} debounceFn={debounceFn}>
      {children}
    </Debounce>
  );

describe('<Debounce />', () => {
  it('renders the `children` immediately on first render', async () => {
    const { queryByText } = renderTestComponent({ delay, children });
    expect(queryByText(/test/)).toBeInTheDocument();
  });

  it('should debounce the state update on component rerender', async () => {
    const { rerender, queryByText } = renderTestComponent({ delay, children });
    rerender(
      <Debounce delay={250}>
        <p>test rerender 1</p>
      </Debounce>
    );
    rerender(
      <Debounce delay={250}>
        <p>test rerender 2</p>
      </Debounce>
    );
    await waitFor(() => {
      expect(queryByText(/test rerender 1/)).not.toBeInTheDocument();
      expect(queryByText(/test rerender 2/)).toBeInTheDocument();
    });
  });

  it('should cleanup the debounce timer when the component unmounts', async () => {
    const mockCleanup = jest.fn();
    const { unmount, rerender } = renderTestComponent({
      delay,
      children,
      debounceFn: () => ({ cleanup: mockCleanup }),
    });
    rerender(
      <Debounce delay={250}>
        <p>test rerender 1</p>
      </Debounce>
    );

    expect(mockCleanupDebounce).toHaveBeenCalledTimes(0);
    unmount();
    expect(mockCleanupDebounce).toHaveBeenCalledTimes(1);
  });
});
