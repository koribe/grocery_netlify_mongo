export default function fetchErrorHandler(responseBody) {
  if (responseBody.code === 100000) {
    return errorRes(responseBody.code, `Szerver hiba! Próbáld újra!`);
  }

  if (responseBody.code === 100001) {
    return errorRes(
      responseBody.code,
      `Hibás adatbázis adatok! Keresd fel az oldal üzemeltetőjét!`
    );
  }

  //Registration errors
  if (responseBody.code === 100101) {
    return errorRes(responseBody.code, `Hiányzó regisztrációs adatok!`);
  }
  if (responseBody.code === 100102) {
    return errorRes(responseBody.code, `Hibás regisztrációs kulcs!`);
  }
  if (responseBody.code === 100103) {
    return errorRes(responseBody.code, `A felhasználónév már foglalt!`);
  }

  //Login errors
  if (responseBody.code === 100202) {
    return errorRes(responseBody.code, `Nincs ilyen felhasználó!`);
  }
  if (responseBody.code === 100203) {
    return errorRes(responseBody.code, `Helytelen jelszó!`);
  }
  if (responseBody.code === 100201) {
    return errorRes(responseBody.code, `Hiányzó bejelentkezési adatok!`);
  }

  //Grocery errors
  if (responseBody.code === 100002) {
    return errorRes(
      responseBody.code,
      `Hibás authentication header! Lépj be újra!`
    );
  }

  if (responseBody.code === 100003) {
    return errorRes(responseBody.code, `Hibás token! Lépj be újra!`);
  }

  if (responseBody.code === 100004) {
    return errorRes(responseBody.code, `Hiányzó adat(ok)!`);
  }

  if (responseBody.code === 100005) {
    return errorRes(responseBody.code, `A tétel már szerepel a listán!`);
  }

  if (responseBody.code === 100006) {
    return errorRes(responseBody.code, `Nem endgedélyezett HTTP kérés!`);
  }
  if (responseBody.code === 100007) {
    return errorRes(responseBody.code, `Max. 50 tétel!`);
  }
  if (responseBody.code === 100008) {
    return errorRes(responseBody.code, `Max. 30 karakter!`);
  }

  return errorRes(500, `Szerver hiba! Próbáld újra!`);
}

function errorRes(code, message) {
  return {
    status: "failed",
    statusCode: code,
    body: message,
  };
}
