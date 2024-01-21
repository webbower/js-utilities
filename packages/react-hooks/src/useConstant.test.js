import { describe } from 'riteway';
import { renderHook } from '@testing-library/react-hooks';

import useConstant from './useConstant.js';

describe('useConstant()', assert => {
  const testStateValue = { value: 'abc' };

  const { result } = renderHook(() => useConstant(testStateValue));

  assert({
    given: 'a value',
    should: 'return the same value',
    actual: result.current === testStateValue,
    expected: true,
  });
});
