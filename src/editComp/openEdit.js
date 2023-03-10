import { Variables } from "../../globalVars.mjs";
import closeEdit from "./closeEdit.mjs";
import editSubmit from "./editSubmit.mjs";
const openEdit = (clickedArticle) => {
  const itemID = clickedArticle.attributes[0].value; //attribute data-id
  Variables.originalValue = clickedArticle.children[0].innerHTML;
  Variables.editFlag = true;
  //Change the title paragraph with edit input
  const addEditInput = document.createElement("input");
  addEditInput.id = "edit-input";
  addEditInput.type = "text";
  addEditInput.value = Variables.originalValue;
  addEditInput.setAttribute("maxLength", 30);
  clickedArticle.children[0].innerHTML = "<form></form>";
  clickedArticle.children[0].firstChild.appendChild(addEditInput);
  clickedArticle.children[0].firstChild.insertAdjacentHTML(
    "beforeend",
    `<button type="submit" class="edit-btn accept-edit fa fa-check">

     </button>
     <button type="button" class="delete-btn deny-edit fa fa-times">

    </button>`
  );
  const editInput = document.querySelector("#edit-input");
  editInput.focus();

  document.querySelector(".deny-edit").addEventListener("click", () => {
    closeEdit(Variables.originalValue);
    Variables.editFlag = false;
  });

  const acceptEdit = document.querySelector(".accept-edit");
  acceptEdit.addEventListener("click", (e) => {
    e.preventDefault();
    editSubmit(editInput, itemID);
  });
};

export { openEdit };
