type ObserverHandlers<T> = {
  next: (value: T) => void;
  error: (message: Error) => void;
  complete: () => void;
};

class Observer<T> {
  private handlers;
  private isUnsubscribed;
  private unsubscribeCallback: (() => void) | undefined = undefined;

  constructor(handlers: ObserverHandlers<T>) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  _addUnsubscribeCallback(callback: () => void) {
    this.unsubscribeCallback = callback;
  }

  next(value: T) {
    if (!this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error: Error) {
    if (!this.isUnsubscribed) {
      this.handlers.error(error);
    }

    this.unsubscribe();
  }

  complete() {
    if (!this.isUnsubscribed) {
      this.handlers.complete();
    }

    this.unsubscribe();
  }

  unsubscribe() {
    this.isUnsubscribed = true;
    console.log("Unsubscribing", this.isUnsubscribed);

    if (this.unsubscribeCallback) {
      this.unsubscribeCallback();
    }
  }
}

export class Observable<T> {
  _subscribe;

  constructor(subscribe: (observer: Observer<T>) => () => void) {
    this._subscribe = subscribe;
  }

  subscribe(handlers: ObserverHandlers<T>) {
    const observer = new Observer(handlers);
    observer._addUnsubscribeCallback(this._subscribe(observer));

    return {
      unsubscribe: () => observer.unsubscribe(),
    };
  }

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
