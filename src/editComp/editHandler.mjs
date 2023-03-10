import { Variables } from "../../globalVars.mjs";
import closeEdit from "./closeEdit.mjs";
import { openEdit } from "./openEdit.js";
export default function editHandler(e) {
  //If there's edit in progress, we close it
  if (Variables.editFlag) {
    closeEdit(Variables.originalValue);
    Variables.editFlag = false;
  }
  openEdit(e.target.parentElement.parentElement);
}
