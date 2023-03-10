import editHandler from "../editComp/editHandler.mjs";
import delHandler from "../deleteComp/delHandler.mjs";

export default function editDelListenRemove() {
  //Remove edit, delete eventlisteners (if there is any) after every database read
  const allEditBtns = document.querySelectorAll(".edit-btn");
  const allDelBtns = document.querySelectorAll(".delete-btn");
  if (allEditBtns.length > 0) {
    allEditBtns.forEach((btn) => btn.removeEventListener("click", editHandler));
    allDelBtns.forEach((btn) => btn.removeEventListener("click", delHandler));
  }
}
