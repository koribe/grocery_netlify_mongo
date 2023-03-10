export class RegMissingInputs extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegMissingInputs);
    }

    this.name = "RegMissingInputs";
  }
}
