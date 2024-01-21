import { describe } from 'riteway';
import { renderHook, act } from '@testing-library/react-hooks';

import { useObjectState } from './useObjectState.js';

describe('useObjectState()', async assert => {
  const getHookStateValue = result => result.current[0];
  const getHookStateApi = result => result.current[1];

  {
    let messWithInitialState = false;
    const shouldUseMessedWithInitialState = () => messWithInitialState;
    const initialState = {
      str: '',
      num: 0,
      list: ['one', 'two', 'three'],
      flag: false,
    };
    const { result } = renderHook(() =>
      useObjectState(
        shouldUseMessedWithInitialState()
          ? {
              ...initialState,
              num: 1,
            }
          : initialState
      )
    );
    const initialApi = getHookStateApi(result);

    assert({
      given: 'hook initialization',
      should: 'return the initial state value and the API',
      actual: [getHookStateValue(result), getHookStateApi(result)],
      expected: [initialState, initialApi],
    });

    act(() => {
      getHookStateApi(result).setField('num', 1);
    });

    assert({
      given: 'updating one field with the `.setField()` API function',
      should: 'return the updated state and the same API object by identity',
      actual: [getHookStateValue(result), getHookStateApi(result) === initialApi],
      expected: [
        {
          str: '',
          num: 1,
          list: ['one', 'two', 'three'],
          flag: false,
        },
        true,
      ],
    });

    act(() => {
      getHookStateApi(result).update({ str: 'updated', flag: true, list: [] });
      // Simulate an unstable initialState arg to ensure that `.reset()` will correctly set the original
      // initialState when called. This unstable arg may happen when the initialState is set by a prop instead of
      // a hard-coded value.
      messWithInitialState = true;
    });

    assert({
      given: 'updating object state with the `.update()` API function',
      should: 'return the updated state',
      actual: getHookStateValue(result),
      expected: {
        str: 'updated',
        num: 1,
        list: [],
        flag: true,
      },
    });

    act(() => {
      getHookStateApi(result).reset();
    });

    assert({
      given: 'updating object state with the `.reset()` API function',
      should: 'return the original initial state',
      actual: getHookStateValue(result),
      expected: initialState,
    });

    act(() => {
      getHookStateApi(result).set({
        str: 'set',
        num: -1,
        list: ['1', '2', '3'],
        flag: true,
      });
    });

    assert({
      given: 'updating the whole object state with the `.set()` API function',
      should: 'return the updated state',
      actual: getHookStateValue(result),
      expected: {
        str: 'set',
        num: -1,
        list: ['1', '2', '3'],
        flag: true,
      },
    });
  }
});
