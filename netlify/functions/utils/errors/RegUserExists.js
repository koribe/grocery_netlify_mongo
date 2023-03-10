export class RegUserExists extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegUserExists);
    }

    this.name = "RegUserExists";
  }
}
