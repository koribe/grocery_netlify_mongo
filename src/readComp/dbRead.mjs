import editDelListenRemove from "../functions/editDelListenRemove.mjs";
import populateList from "./populateList.mjs";
import {
  newItemName,
  htmlGroceryList,
  loading,
  deleteAllBtn,
  Variables,
} from "../../globalVars.mjs";
import requestRead from "../groceryApiCalls/requestRead.js";
import groceryDisplayAlert from "../functions/groceryDisplayAlert.mjs";

export default async function dbRead() {
  displayLoading();
  deleteAllBtn.classList.remove("show-clear-btn");
  const readResponse = await requestRead(Variables.jwt);
  hideLoading();
  if (readResponse.status !== "success")
    groceryDisplayAlert(readResponse.body, readResponse.status);
  else {
    htmlGroceryList.innerHTML = "";
    //Remove edit and delete eventlisteners(if there is any) after every database read
    editDelListenRemove();
    //We remove classlist from htmlGroceryContainer because after delete request the collection can be empty
    newItemName.value = "";
    Variables.editFlag = false;
    if (readResponse.body.length > 0) {
      deleteAllBtn.classList.add("show-clear-btn");
      //We populate the grocery-list with fetched documents
      readResponse.body.forEach((element) => {
        populateList(element._id, element.item);
      });
      const listPopulated = new Event("listPopulated");
      document.dispatchEvent(listPopulated);
    }
  }
}

// showing loading
function displayLoading() {
  loading.classList.add("display");
}

// hiding loading
function hideLoading() {
  loading.classList.remove("display");
}
