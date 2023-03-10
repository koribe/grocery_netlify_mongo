export class LoginPwdIncorrect extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoginPwdIncorrect);
    }

    this.name = "LoginPwdIncorrect";
  }
}
