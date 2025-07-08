/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from "react";

type Derived = {
  [K in string]: (...args: any[]) => unknown;
};

type ActionMap<TState> = {
  [key: string]: (...args: any[]) => Partial<TState>;
};

type Actions<TActions extends ActionMap<object>> = {
  [K in keyof TActions]: (...args: Parameters<TActions[K]>) => void;
};

type Listener = () => void;
type SubscribeFn = (listener: Listener) => () => void;

type Observable<
  TState extends object,
  TDerived extends Derived,
  TActionMap extends ActionMap<TState>
> = {
  getSnapshot(): TState & TDerived & Actions<TActionMap>;
  subscribe: SubscribeFn;
};
export function createObservable<
  TState extends object,
  TDerived extends Derived,
  TActionMap extends ActionMap<TState>
>(args: {
  init: () => TState;
  derive: (state: TState) => TDerived;
  act: (state: TState, derived: TDerived) => TActionMap;
}): Observable<TState, TDerived, TActionMap> {
  let listeners: Listener[] = [];

  function subscribe(listener: Listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function createSnapshot(
    state: TState
  ): TState & TDerived & Actions<TActionMap> {
    const derived = args.derive(state);

    const actions: Actions<TActionMap> = mapObj(
      args.act(state, derived),
      (actions) => {
        const mappedEntries = Object.entries(actions).map(([key, value]) => [
          key,
          (...args: unknown[]) =>
            emitChange({ ...state, ...value.apply(state, args) }),
        ]);
        return Object.fromEntries(mappedEntries);
      }
    );

    return {
      ...state,
      ...derived,
      ...actions,
    };
  }

  let snapshot = createSnapshot(args.init());

  function emitChange(state: TState) {
    snapshot = createSnapshot({ ...snapshot, ...state });
    listeners.forEach((l) => l());
  }

  function getSnapshot() {
    console.log("getSnapshot", snapshot);
    return snapshot;
  }

  return { getSnapshot, subscribe };
}

export function useObservable<
  TState extends object,
  TDerived extends Derived,
  TActions extends ActionMap<TState>
>(observable: ReturnType<typeof createObservable<TState, TDerived, TActions>>) {
  return useSyncExternalStore(observable.subscribe, observable.getSnapshot);
}

type Mapped<TIn, TOut extends { [K in keyof TIn]: unknown }> = {
  [K in keyof TIn]: TOut[K];
} & {
  // Enforce that TB doesn't have any extra keys
  [K in Exclude<keyof TOut, keyof TIn>]: never;
};

function mapObj<From, To extends { [K in keyof From]: unknown }>(
  input: From,
  mapper: (input: From) => Mapped<From, To>
): Mapped<From, To> {
  return mapper(input);
}
