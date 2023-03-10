import fetchErrorHandler from "../functions/fetchErrorHandler.js";

async function requestReg(username, password, regkey) {
  try {
    const response = await fetch("/.netlify/functions/user_reg", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        regkey: regkey,
      }),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      if (responseBody) return fetchErrorHandler(responseBody);

      return {
        statusCode: response.status,
        body: `Hiba történt a regisztráció közben! ${response.statusText} Próbáld újra!`,
      };
    }
    return {
      statusCode: response.status,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: `Szerver hiba: ${error.message}`,
    };
  }
}

export default requestReg;
