import { errors } from "../errors.mjs";
async function editDatabase(jwt, itemID, itemName) {
  try {
    const response = await fetch("/.netlify/functions/db_read", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({ _id: itemID, item: itemName }),
    });
    if (!response.ok) {
      const responseBody = await response.json();
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
      if (responseBody && responseBody.code === errors.ITEM_EXISTS) {
        return {
          statusCode: response.status,
          body: `A tétel már szerepel a listán!`,
        };
      }
      return {
        statusCode: response.status,
        body: `MongoDB create function fetch error: ${response.statusText}`,
      };
    }
    return {
      statusCode: response.status,
    };
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

export default editDatabase;
