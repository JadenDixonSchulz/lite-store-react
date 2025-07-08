/* eslint-disable @typescript-eslint/no-explicit-any */

export type Derived = {
  // any is used here to defer inference
  // if you know a better way hit me up
  [K in string]: (...args: any[]) => unknown;
};

export type ActionMap<TState> = {
  // any is used here to defer inference
  // if you know a better way hit me up
  [key: string]: (...args: any[]) => Partial<TState>;
};

export type Actions<TActions extends ActionMap<object>> = {
  [K in keyof TActions]: (...args: Parameters<TActions[K]>) => void;
};

export type Listener = () => void;
export type SubscribeFn = (listener: Listener) => () => void;

export type Observable<
  TState extends object,
  TDerived extends Derived,
  TActionMap extends ActionMap<TState>
> = {
  getSnapshot(): TState & TDerived & Actions<TActionMap>;
  subscribe: SubscribeFn;
};
