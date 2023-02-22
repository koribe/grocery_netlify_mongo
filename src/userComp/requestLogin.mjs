import { errors } from "../../errors.mjs";

async function requestLogin(username, password) {
  try {
    const response = await fetch("/.netlify/functions/user_login", {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      if (responseBody && responseBody.code === errors.DB_AUTH_FAIL) {
        return {
          statusCode: response.status,
          body: `Hibás adatbázis adatok! Keresd fel az oldal üzemeltetőjét!`,
        };
      }
      if (responseBody && responseBody.code === errors.USER_NAME_AUTH_FAIL) {
        return {
          statusCode: response.status,
          body: `Nincs ilyen felhasználó!`,
        };
      }
      if (responseBody && responseBody.code === errors.USER_PWD_AUTH_FAIL) {
        return {
          statusCode: response.status,
          body: `Helytelen jelszó`,
        };
      }
      if (responseBody && responseBody.code === errors.MISSING_AUTH_INPUTS) {
        return {
          statusCode: response.status,
          body: `Hiányzó bejelentkezési adatok!`,
        };
      }
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
      body: JSON.stringify({
        message: `Szerver hiba: ${error.message}`,
      }),
    };
  }
}

export default requestLogin;
