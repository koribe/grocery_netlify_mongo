import userLogReg from "./src/userComp/userLogReg.mjs";
import createHandler from "./src/createComp/createHandler.mjs";
import deleteItem from "./src/deleteComp/deleteItem.mjs";
import dbRead from "./src/readComp/dbRead.mjs";
import groceryDisplayAlert from "./src/functions/groceryDisplayAlert.mjs";
import editHandler from "./src/editComp/editHandler.mjs";
import delHandler from "./src/deleteComp/delHandler.mjs";

import {
  Variables,
  newItemBtn,
  deleteAllBtn,
  logoutCont,
} from "./globalVars.mjs";

document.addEventListener("authenticated", () => {
  Variables.jwt = getJWT();
  if (Variables.jwt) {
    logoutCont.style.display = "flex";

    const currentLogin = document.querySelector("#current-login");
    currentLogin.innerHTML = localStorage.getItem("currentloggedin");

    const logoutBtn = document.querySelector("#logout-btn");
    logoutBtn.addEventListener("click", function logout() {
      removeJWT();
      location.reload();
    });

    //Read-------------------------------------------------------
    dbRead();

    //Create----------------------------------------------------------------

    newItemBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const createResponse = await createHandler();
      groceryDisplayAlert(createResponse.body, createResponse.status);
      if (createResponse.status === "success") dbRead();
    });

    document.addEventListener("listPopulated", () => {
      //Edit------------------------------------------------------------------
      const editBtns = document.querySelectorAll(".edit-btn");
      editBtns.forEach((btn) => {
        btn.addEventListener("click", editHandler);
      });

      //Delete---------------------------------------------------------
      const deleteBtns = document.querySelectorAll(".delete-btn");
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", delHandler);
      });
    });

    //Delete All-----------------------------------------------------
    deleteAllBtn.addEventListener("click", async () => {
      const delAllResponse = await deleteItem("all", "");
      groceryDisplayAlert(delAllResponse.body, delAllResponse.status);
      if (delAllResponse.status === "success") dbRead();
    });
  }
});

async function main() {
  if (getJWT()) {
    const authenticatedLocal = new Event("authenticated");
    document.dispatchEvent(authenticatedLocal);
  } else {
    userLogReg();
  }
}
main();

//return JWT if stored in local storage
function getJWT() {
  return localStorage.getItem("authToken");
}
function removeJWT() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentloggedin");
}
