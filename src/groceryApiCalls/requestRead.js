import fetchErrorHandler from "../functions/fetchErrorHandler.js";

async function requestRead(jwt) {
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
      if (responseBody) return fetchErrorHandler(responseBody);
      return {
        status: "failed",
        statusCode: response.status,
        body: `Hiba az adatbázis kiolvasás közben: ${response.statusText}`,
      };
    }
    return {
      status: "success",
      statusCode: response.status,
      body: responseBody,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      statusCode: 500,
      body: `Handler function error: ${error.message}`,
    };
  }
}

export default requestRead;
