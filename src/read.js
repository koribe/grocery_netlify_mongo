import { errors } from "../errors.mjs";

async function readData(jwt) {
  try {
    const response = await fetch("/.netlify/functions/db_read", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });
    const responseBody = await response.json();
    if (!response.ok) {
      if (responseBody && responseBody.code === errors.DB_AUTH_FAIL) {
        return {
          statusCode: response.status,
          body: `Nem sikerült csatlakozni az adatbázishoz! Próbáld újra!`,
        };
      }
      if (responseBody && responseBody.code === errors.INVALID_JWT) {
        return {
          statusCode: response.status,
          body: `Hibás token! Lépj be újra!`,
        };
      }
      return {
        statusCode: response.status,
        body: `MongoDB read function fetch error: ${response.statusText}`,
      };
    }
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
