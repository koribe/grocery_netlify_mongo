import { errors } from "../../errors.mjs";

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
      if (responseBody && responseBody.code === errors.DB_AUTH_FAIL) {
        return {
          statusCode: response.status,
          body: `Hibás adatbázis adatok! Keresd fel az oldal üzemeltetőjét!`,
        };
      }

      if (responseBody && responseBody.code === errors.MISSING_REG_INPUTS) {
        return {
          statusCode: response.status,
          body: `Hiányzó regisztrációs adatok!`,
        };
      }
      if (responseBody && responseBody.code === errors.INVALID_REGKEY) {
        return {
          statusCode: response.status,
          body: `Hibás regisztrációs kulcs!`,
        };
      }
      if (responseBody && responseBody.code === errors.USER_REG_EXISTS) {
        return {
          statusCode: response.status,
          body: `A felhasználónév már foglalt!`,
        };
      }

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
      body: JSON.stringify({
        message: `Szerver hiba: ${error.message}`,
      }),
    };
  }
}

export default requestReg;
