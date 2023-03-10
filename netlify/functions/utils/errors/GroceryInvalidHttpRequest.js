export class GroceryInvalidHttpRequest extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryInvalidHttpRequest);
    }

    this.name = "GroceryInvalidHttpRequest";
  }
}
