import { DOMElement } from "../html/lib";

type Effect = () => void;

let currentEffect: Effect | null = null;

export function $signal<T>(initialValue: T) {
  let value = initialValue;

  const subscribers = new Set<Effect>();

  return {
    get value() {
      if (currentEffect) {
        subscribers.add(currentEffect);
      }
      return value;
    },
    set value(newValue: T) {
      value = newValue;

      for (const subscriber of subscribers) {
        subscriber();
      }
    },
  };
}

export function $effect(fn: Effect) {
  currentEffect = fn;

  fn();
}
