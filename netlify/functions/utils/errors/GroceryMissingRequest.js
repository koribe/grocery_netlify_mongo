export class GroceryMissingRequest extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryMissingRequest);
    }

    this.name = "GroceryMissingRequest";
  }
}
