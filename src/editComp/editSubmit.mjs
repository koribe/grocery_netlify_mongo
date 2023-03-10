import requestEdit from "../groceryApiCalls/requestEdit.js";
import dbRead from "../readComp/dbRead.mjs";
import validateEdit from "./validateEdit.mjs";
import groceryDisplayAlert from "../functions/groceryDisplayAlert.mjs";
import { Variables } from "../../globalVars.mjs";
export default async function editSubmit(editInput, itemID) {
  const editError = validateEdit(editInput);
  if (editError) {
    groceryDisplayAlert(editError.body, editError.status);
  } else {
    const lowerEditInput = editInput.value.toLowerCase();
    const editResponse = await requestEdit(
      Variables.jwt,
      itemID,
      lowerEditInput
    );
    groceryDisplayAlert(editResponse.body, editResponse.status);
    if (editResponse.status === "success") dbRead();
  }
}
