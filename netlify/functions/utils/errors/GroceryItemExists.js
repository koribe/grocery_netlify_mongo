export class GroceryItemExists extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryItemExists);
    }

    this.name = "GroceryItemExists";
  }
}
