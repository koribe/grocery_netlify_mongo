import fetchErrorHandler from "../functions/fetchErrorHandler.js";

async function requestLogin(username, password) {
  try {
    const response = await fetch("/.netlify/functions/user_login", {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      if (responseBody) return fetchErrorHandler(responseBody);
      return {
        statusCode: response.status,
        body: `Hiba történt a bejelentkezés közben! ${response.statusText} Próbáld újra!`,
      };
    }
    return {
      statusCode: response.status,
      token: responseBody.token,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: `Szerver hiba: ${error.message}`,
    };
  }
}

export default requestLogin;
