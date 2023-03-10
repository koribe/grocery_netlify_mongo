import fetchErrorHandler from "../functions/fetchErrorHandler.js";
async function requestDelete(jwt, itemID) {
  try {
    const response = await fetch("/.netlify/functions/db_read", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({ _id: itemID }),
    });
    if (!response.ok) {
      const responseBody = await response.json();
      if (responseBody) return fetchErrorHandler(responseBody);
      return {
        status: "failed",
        statusCode: response.status,
        body: `Szerver hiba törlés közben: ${response.statusText}`,
      };
    }
    return {
      status: "success",
      statusCode: response.status,
      body: "Sikeres törlés!",
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

export default requestDelete;
