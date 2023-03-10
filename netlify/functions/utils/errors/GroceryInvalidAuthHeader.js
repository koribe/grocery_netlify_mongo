export class GroceryInvalidAuthHeader extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryInvalidAuthHeader);
    }

    this.name = "GroceryInvalidAuthHeader";
  }
}
