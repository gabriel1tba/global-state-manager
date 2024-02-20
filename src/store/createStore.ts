type SetterFn<U> = (prevState: U) => Partial<U>;
type SetStateFn<T> = (partialState: Partial<T> | SetterFn<T>) => void;

export function createStore<T extends Record<string, any>>(
  createState: (setState: SetStateFn<T>) => T,
) {
  let state: T;
  let listeners: Set<() => void>;

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<T> | SetterFn<T>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = { ...state, ...newValue };
    notify();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function getState() {
    return state;
  }

  state = createState(setState);
  listeners = new Set();

  return { setState, getState, subscribe };
}
