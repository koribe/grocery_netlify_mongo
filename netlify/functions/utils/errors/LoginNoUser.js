export class LoginNoUser extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoginNoUser);
    }

    this.name = "LoginNoUser";
  }
}
