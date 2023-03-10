import { MongoServerError } from "mongodb";
import { errors } from "./errors/errorCodes/errors.mjs";
import { GroceryCharExceed } from "./errors/GroceryCharExceed.js";
import { GroceryInvalidAuthHeader } from "./errors/GroceryInvalidAuthHeader.js";
import { GroceryInvalidHttpRequest } from "./errors/GroceryInvalidHttpRequest.js";
import { GroceryInvalidJwt } from "./errors/GroceryInvalidJwt.js";
import { GroceryItemExists } from "./errors/GroceryItemExists.js";
import { GroceryListExceed } from "./errors/GroceryListExceed.js";
import { GroceryMissingRequest } from "./errors/GroceryMissingRequest.js";
import { LoginMissingInputs } from "./errors/LoginMissingInputs.js";
import { LoginNoUser } from "./errors/LoginNoUser.js";
import { LoginPwdIncorrect } from "./errors/LoginPwdIncorrect.js";
import { RegInvalidRegkey } from "./errors/RegInvalidRegkey.js";
import { RegMissingInputs } from "./errors/RegMissingInputs.js";
import { RegUserExists } from "./errors/RegUserExists.js";
import { httpResponse } from "./httpResponse.js";
export function transformToApiError(error) {
  if (error instanceof MongoServerError && error.code === 8000) {
    return httpResponse(501, {
      code: errors.DB_AUTH_FAIL,
      error:
        "Database authentication failed(Invalid DB username, password or cluster)",
    });
  }

  //Registration errors
  if (error instanceof RegMissingInputs) {
    return httpResponse(401, {
      code: errors.REG_MISSING_INPUTS,
      error: error.message,
    });
  }
  if (error instanceof RegInvalidRegkey) {
    return httpResponse(401, {
      code: errors.REG_INVALID_REGKEY,
      error: error.message,
    });
  }
  if (error instanceof RegUserExists) {
    return httpResponse(401, {
      code: errors.REG_USER_EXISTS,
      error: error.message,
    });
  }

  //Login errors
  if (error instanceof LoginMissingInputs) {
    return httpResponse(401, {
      code: errors.LOGIN_MISSING_INPUTS,
      error: error.message,
    });
  }
  if (error instanceof LoginNoUser) {
    return httpResponse(401, {
      code: errors.LOGIN_NO_USER,
      error: error.message,
    });
  }
  if (error instanceof LoginPwdIncorrect) {
    return httpResponse(401, {
      code: errors.LOGIN_PWD_INCORRECT,
      error: error.message,
    });
  }

  //Grocery errors
  if (error instanceof GroceryInvalidAuthHeader) {
    return httpResponse(401, {
      code: errors.GROCERY_INVALID_AUTH_HEADER,
      error: error.message,
    });
  }
  if (error instanceof GroceryInvalidJwt) {
    return httpResponse(401, {
      code: errors.GROCERY_INVALID_JWT,
      error: error.message,
    });
  }
  if (error instanceof GroceryMissingRequest) {
    return httpResponse(401, {
      code: errors.GROCERY_MISSING_REQUEST,
      error: error.message,
    });
  }
  if (error instanceof GroceryItemExists) {
    return httpResponse(409, {
      code: errors.GROCERY_ITEM_EXISTS,
      error: error.message,
    });
  }
  if (error instanceof GroceryInvalidHttpRequest) {
    return httpResponse(401, {
      code: errors.GROCERY_INVALID_HTTP_REQUEST,
      error: error.message,
    });
  }
  if (error instanceof GroceryListExceed) {
    return httpResponse(401, {
      code: errors.GROCERY_LIST_EXCEEDED,
      error: error.message,
    });
  }
  if (error instanceof GroceryCharExceed) {
    return httpResponse(401, {
      code: errors.GROCERY_CHAR_EXCEEDED,
      error: error.message,
    });
  }

  console.error("Something went wrong:", error);
  return httpResponse(500, {
    code: errors.UNKNOWN_ERROR,
    error: "Server error occurred. Please try again!",
  });
}
