export class GroceryListExceed extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroceryListExceed);
    }

    this.name = "GroceryListExceed";
  }
}
