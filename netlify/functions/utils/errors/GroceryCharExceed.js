export class GroceryCharExceed extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryCharExceed);
    }

    this.name = "GroceryCharExceed";
  }
}
