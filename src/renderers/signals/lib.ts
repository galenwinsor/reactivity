type Effect = () => void;

/** The effect that's currently running. Used to implicitly track signal dependencies. */
let currentEffect: Effect | null = null;

/**
 * A single state variable, with an initial value of some type `T`.
 * @param initialValue The initial value of the state variable.
 * @returns An object with `get` and `set` methods defined for accessing and mutating
 * the state variable's value.
 */
export function $signal<T>(initialValue: T) {
  /** The current value of the state variable. */
  let value = initialValue;

  /** All effects that are subscribed to this signal. */
  const subscribers = new Set<Effect>();

  return {
    /** If this signal's value is accessed in an `Effect`, add that effect to this signal's subscribers. */
    get value() {
      if (currentEffect) {
        subscribers.add(currentEffect);
      }
      return value;
    },
    /**
     * Sets the value of this signal to a new value, then runs all subscribed effects.
     * @param newValue The new value.
     */
    set value(newValue: T) {
      value = newValue;

      for (const subscriber of subscribers) {
        subscriber();
      }
    },
  };
}

/**
 * Runs the provided effect and sets the currently running effect.
 * @param fn The effect.
 */
export function $effect(fn: Effect) {
  currentEffect = fn;

  fn();
}
