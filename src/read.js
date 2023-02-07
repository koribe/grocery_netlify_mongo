import { errors } from "../errors.mjs";

async function readData(username) {
  try {
    const response = await fetch("/.netlify/functions/db_read", {
      method: "POST",
      body: JSON.stringify({ username: username }),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      if (
        responseBody &&
        responseBody.code === errors.INVALID_DATABASE_USERNAME
      ) {
        return {
          statusCode: response.status,
          body: `Invalid username provided. Please supply the correct username`,
        };
      }
      return {
        statusCode: response.status,
        body: `MongoDB read function fetch error: ${response.statusText}`,
      };
    }
    console.log(responseBody);
    return responseBody;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Handler function error: ${error.message}`,
      }),
    };
  }
}

export default readData;
