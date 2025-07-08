import { createStore } from "../../src/store.core";
import { useStore } from "../../src/store.react";

// Fully inferred!
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
