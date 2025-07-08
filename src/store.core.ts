import type {
  Derived,
  ActionMap,
  Observable,
  Listener,
  Actions,
} from "./store.types";
import { mapObj } from "./util";

export function createStore<
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
