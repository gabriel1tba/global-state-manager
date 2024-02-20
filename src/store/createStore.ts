import { useSyncExternalStore } from 'react';

type SetterFn<T> = (prevState: T) => Partial<T>;
type SetStateFn<T> = (partialState: Partial<T> | SetterFn<T>) => void;

export function createStore<TState extends Record<string, any>>(
  createState: (setState: SetStateFn<TState>, getState: () => TState) => TState,
) {
  let state: TState;
  let listeners: Set<() => void>;

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = { ...state, ...newValue };
    notify();
  }

  function getState() {
    return state;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function useStore<TSelected>(selector: (currentState: TState) => TSelected) {
    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createState(setState, getState);
  listeners = new Set();

  return useStore;
}
