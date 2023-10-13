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
      // if there exists observers for this event
      try {
        this.observers[event].forEach((observer) => observer.update(data));
        return true;
      } catch (error) {
        console.error("Error updating Game events");
      }
    } else {
      return false;
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
