// Create a custom error by extending the Error constructor
export class CustomError extends Error {
  constructor(message) {
    super(message); // Error message the user sees
    this.name = "CustomError"; // Set the error name
  }
}
