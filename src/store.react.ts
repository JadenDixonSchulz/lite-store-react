import { useSyncExternalStore } from "react";
import type { Derived, ActionMap } from "./store.types";

import type { createStore } from "./store.core";

export function useStore<
  TState extends object,
  TDerived extends Derived,
  TActions extends ActionMap<TState>
>(observable: ReturnType<typeof createStore<TState, TDerived, TActions>>) {
  return useSyncExternalStore(observable.subscribe, observable.getSnapshot);
}
