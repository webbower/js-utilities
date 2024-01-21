# React Hooks

A collection of custom React hooks for various utility purposes.

## State Hooks

Hooks that provide additional functionality and semantics on top of React
primitive hooks like `useState`, `useEffect`, and `useRef`.

### Constant Hook

Always return the same value for the entire lifetime of the component.

### Boolean State Hook

State hook with a state updating API tailored to boolean state.

### Number State Hook

State hook with a state updating API tailored to number state.

### Object State Hook

State hook with a state updating API tailored to object state.

## Effect

### On Mounted Effect Hook

Thin wrapper around `useEffect` to only trigger the effect on mount and
optionally unmount.
