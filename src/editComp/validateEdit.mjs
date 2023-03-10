import { Variables } from "../../globalVars.mjs";
import closeEdit from "./closeEdit.mjs";
export default function validateEdit(editInput) {
  //Checks if the input value is an empty string
  if (editInput.value === "") {
    editInput.value = Variables.originalValue;
    editInput.focus();
    return { status: "failed", statusCode: 100004, body: "Hiányzó tételnév" };
  }

  //All database entry stored in lowercase
  const lowerEditInput = editInput.value.toLowerCase();

  //If the edited name is equal as the original name, close the edit
  if (lowerEditInput === Variables.originalValue) {
    closeEdit(Variables.originalValue);
    Variables.editFlag = false;
    return {
      status: "success",
      statusCode: 304,
      body: "Nem történt változás",
    };
  }

  //Max 30 character long entry
  if (lowerEditInput > 30) {
    editInput.focus();
    return { status: "failed", statusCode: 100008, body: "Max. 30 karakter" };
  }

  //Checks if the list already contains the input value
  let contains = false;
  const allItemName = document.querySelectorAll(".title");
  for (let item of allItemName) {
    contains = item.innerHTML === lowerEditInput ? true : false;
    if (contains) break;
  }
  if (contains) {
    editInput.focus();
    return {
      status: "failed",
      statusCode: 100005,
      body: "Már szerepel a listán",
    };
  }
}
