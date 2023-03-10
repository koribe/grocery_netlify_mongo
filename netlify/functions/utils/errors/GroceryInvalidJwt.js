export class GroceryInvalidJwt extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryInvalidJwt);
    }

    this.name = "GroceryInvalidJwt";
  }
}
