type ObserverHandlers<T> = {
  next: (value: T) => void;
  error: (message: Error) => void;
  complete: () => void;
};

class Observer<T> {
  private handlers;
  private isUnsubscribed;
  private unsubscribeCallback: (() => void) | undefined = undefined;

  /**
   * An object to subscribe to updates in an {@link Observable}.
   * @param handlers The {@link ObserverHandlers} methods to use to track updates
   * to the subscribed observable.
   */
  constructor(handlers: ObserverHandlers<T>) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  /**
   * Used only by the {@link Observable} class to be able to add a cleanup function.
   * @param callback A cleanup function that should be run after the observer unsubscribes.
   */
  _addUnsubscribeCallback(callback: () => void) {
    this.unsubscribeCallback = callback;
  }

  /**
   * Handles a new value from the observable this observer is subscribed to.
   * @param value The new value from the observable.
   */
  next(value: T) {
    if (!this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  /**
   * Handles errors thrown by the observable this observer is subscribed to.
   * @param error The error passed from the observable.
   */
  error(error: Error) {
    if (!this.isUnsubscribed) {
      this.handlers.error(error);
    }

    this.unsubscribe();
  }

  /**
   * Handles when the observable has run out of values. Unsubscribes from the observable.
   */
  complete() {
    if (!this.isUnsubscribed) {
      this.handlers.complete();
    }

    this.unsubscribe();
  }

  /**
   * Manually unsubscribes from the observable (i.e., before the observable closes/completes).
   */
  unsubscribe() {
    this.isUnsubscribed = true;
    console.log("Unsubscribing", this.isUnsubscribed);

    if (this.unsubscribeCallback) {
      this.unsubscribeCallback();
    }
  }
}

export class Observable<T> {
  private _subscribe;

  /**
   * Wraps a stream of values of type `T` and passes them to subscribers.
   * @param subscribe A function to subscribe a new {@link Observer}. Given an observer,
   * pass new values, errors, or completion to the observer. See {@link Observable.fromEvent} for
   * an example.
   */
  constructor(subscribe: (observer: Observer<T>) => () => void) {
    this._subscribe = subscribe;
  }

  /**
   * Subscribe a new observer to this observable.
   * @param handlers The `next`, `error`, and `complete` methods for a subscribed observer.
   * @returns An object with an `unsubscribe` method.
   */
  subscribe(handlers: ObserverHandlers<T>) {
    const observer = new Observer(handlers);
    observer._addUnsubscribeCallback(this._subscribe(observer));

    return {
      unsubscribe: () => observer.unsubscribe(),
    };
  }

  /**
   * Given a function that transforms values of type `T` to some new type `NewT`, return a new
   * `Observable` that streams values from this observable through the function and provides
   * the transformed values.
   * @param fn A function that transforms values in this observable into new values.
   * @returns A new observable with values of type `NewT`.
   */
  pipe<NewT>(fn: (value: T) => NewT) {
    return new Observable<NewT>((observer) => {
      this.subscribe({
        next(value) {
          observer.next(fn(value));
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        },
      });

      return () => {};
    });
  }

  /**
   * Given the name of a DOM event and a target element, creates an observable whose
   * subscriptions create event listeners for that event, then notify observers
   * when the event fires.
   * @param element The target DOM element.
   * @param eventType The DOM event type.
   * @returns A new observable that notifies subscribers when the target event fires.
   */
  static fromEvent(element: HTMLElement, eventType: keyof HTMLElementEventMap) {
    return new Observable<HTMLElementEventMap[typeof eventType]>((observer) => {
      const eventHandler = (event: HTMLElementEventMap[typeof eventType]) =>
        observer.next(event);

      element.addEventListener(eventType, eventHandler);

      return () => {
        element.removeEventListener(eventType, eventHandler);
        console.log("Unsubscribed from event listener");
      };
    });
  }
}
