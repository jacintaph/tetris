export class EventSubject {
  constructor() {
    this.observers = {};
  }

  addObserver(event, observer) {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event].push(observer);
  }

  notify(event, data) {
    if (this.observers[event]) {
      this.observers[event].forEach((observer) => observer.update(data));
    }
  }
}

export class EventObserver {
  constructor(callback) {
    this.callback = callback;
  }

  update(data) {
    this.callback(data);
  }
}