/**
 * @class EventSubject
 * @constructs
 * @classdesc The Event Subject class provides an implementation of the Observer pattern. It allows objects to subscribe to and receive notifications about game events.
 * @example
 * const instance = new EventSubject()
 */
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

/**
 * @class EventObserver
 * @constructs

 * @classdesc The Event Observer class represents an object that observes events and responds to notifications. It's used in conjunction with the EventSubject class to receive event updates. 
 * @param {function} callback A callback function passed by the subject during the notification 
 * @example
 * const instance = new EventSubject()
 */
export class EventObserver {
  constructor(callback) {
    this.callback = callback;
  }

  update(data) {
    this.callback(data);
  }
}
