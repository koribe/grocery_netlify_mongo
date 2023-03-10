import fetchErrorHandler from "../functions/fetchErrorHandler.js";
async function requestEdit(jwt, itemID, itemName) {
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

      if (responseBody) return fetchErrorHandler(responseBody);
      return {
        status: "failed",
        statusCode: response.status,
        body: `Szerver hiba tétel módosítás közben: ${response.statusText}`,
      };
    }
    return {
      status: "success",
      statusCode: response.status,
      body: "Tétel módosítva!",
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

export default requestEdit;
