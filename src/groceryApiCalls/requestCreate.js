import fetchErrorHandler from "../functions/fetchErrorHandler.js";

async function requestCreate(jwt, newItem) {
  try {
    const response = await fetch("/.netlify/functions/db_read", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({ item: newItem }),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      if (responseBody) return fetchErrorHandler(responseBody);
      return {
        status: "failed",
        statusCode: response.status,
        body: `Szerver hiba a tétel létrehozásakor: ${response.statusText}`,
      };
    }
    return {
      status: "success",
      statusCode: response.status,
      body: "Tétel a listához adva!",
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
export default requestCreate;
