import requestDelete from "../groceryApiCalls/requestDelete.js";
import { Variables, groceryLoad } from "../../globalVars.mjs";
import loadingToggle from "../functions/loadingToggle.mjs";
export default async function deleteItem(itemID, itemName) {
  let text = "";
  if (itemName === "") {
    text = "Biztos törlöd a listát?";
  } else {
    text = `Biztos törlöd a "${itemName}" tételt a listáról?`;
  }
  if (confirm(text)) {
    loadingToggle(groceryLoad); //loading state on
    const responseDel = await requestDelete(Variables.jwt, itemID);
    loadingToggle(groceryLoad); //loading state off
    return responseDel;
  }
}
