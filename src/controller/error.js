/**
 * @class CustomError
 * @constructs
 * @param {string} message The custom message sent to the thrown error
 * @classdesc The Custom Error class handles game initialisation errors, particularly those involved in event listener initialisation. A new instance of this class is created when an error is detected. It is used by 'throwing' an error containing the custom message supplied to the constructor.
 * @example
 * const instance = new CustomError("This is an error message")
 */
export class CustomError extends Error {
  constructor(message) {
    super(message); // Error message the user sees
    this.name = "CustomError"; // Set the error name
  }
}
