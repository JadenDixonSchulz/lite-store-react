#  lite-react-store

WIP Minimalist Lightweight Store library for React
Typescript and React first

## Example

```tsx
// Types are fully inferred
// You might not like it, but this is peak typescript!
const counterStore = createStore({
  init: () => ({
    count: 0,
  }),
  derive: (state) => ({
    isEven: () => state.count % 2 === 0,
  }),
  act: (state) => ({
    increment: () => ({ count: state.count + 1 }),
  }),
});

export function Counter() {
  const counter = useStore(counterStore);
  return (
    <div>
      <div>{counter.count}</div>
      <div>Number is{counter.isEven() ? " " : " not "}even</div>
      <button onClick={() => counter.increment()}>increment</button>
    </div>
  );
}
```
