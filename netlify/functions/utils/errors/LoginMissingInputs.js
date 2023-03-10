export class LoginMissingInputs extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoginMissingInputs);
    }

    this.name = "LoginMissingInputs";
  }
}
