import requestDelete from "../groceryApiCalls/requestDelete.js";
import { Variables } from "../../globalVars.mjs";
export default async function deleteItem(itemID, itemName) {
  let text = "";
  if (itemName === "") {
    text = "Biztos törlöd a listát?";
  } else {
    text = `Biztos törlöd a "${itemName}" tételt a listáról?`;
  }
  if (confirm(text)) {
    const responseDel = await requestDelete(Variables.jwt, itemID);
    return responseDel;
  }
}
