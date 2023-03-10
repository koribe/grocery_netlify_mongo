export class RegInvalidRegkey extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegInvalidRegkey);
    }

    this.name = "RegInvalidRegkey";
  }
}
