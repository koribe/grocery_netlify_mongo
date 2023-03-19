import requestEdit from "../groceryApiCalls/requestEdit.js";
import dbRead from "../readComp/dbRead.mjs";
import validateEdit from "./validateEdit.mjs";
import groceryDisplayAlert from "../functions/groceryDisplayAlert.mjs";
import { groceryLoad, Variables } from "../../globalVars.mjs";
import loadingToggle from "../functions/loadingToggle.mjs";
export default async function editSubmit(editInput, itemID) {
  const editError = validateEdit(editInput);
  if (editError) {
    groceryDisplayAlert(editError.body, editError.status);
  } else {
    const lowerEditInput = editInput.value.toLowerCase();
    loadingToggle(groceryLoad); //loading state on
    const editResponse = await requestEdit(
      Variables.jwt,
      itemID,
      lowerEditInput
    );
    loadingToggle(groceryLoad); //loading state off
    groceryDisplayAlert(editResponse.body, editResponse.status);
    if (editResponse.status === "success") dbRead();
  }
}
