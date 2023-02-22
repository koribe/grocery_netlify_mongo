import userLogReg from "./src/userComp/userLogReg.mjs";
import readData from "./src/read.js";
import createItem from "./src/create.js";
import editDatabase from "./src/edit.js";
import deleteDatabase from "./src/delete.js";
import { openEdit, closeEdit } from "./src/functions/editInput.js";

const htmlGroceryContainer = document.querySelector(".grocery-container");
const htmlGroceryList = document.querySelector(".grocery-list");
const listAlert = document.querySelector("#list-alert");
const logoutCont = document.querySelector("#logout-container");

let editFlag = false;
let originalValue = "";

document.addEventListener("authenticated", () => {
  const jwt = getJWT();
  if (jwt) {
    logoutCont.style.display = "flex";

    const currentLogin = document.querySelector("#current-login");
    currentLogin.innerHTML = localStorage.getItem("currentloggedin");

    const logoutBtn = document.querySelector("#logout-btn");
    logoutBtn.addEventListener("click", function logout() {
      removeJWT();
      location.reload();
    });
    //Read-------------------------------------------------------
    //When page is loading and after every database operation, we fetch the data from mongodb
    async function reading() {
      editDelListenRemove();
      readData(jwt).then((fetchedItems) => {
        //We remove classlist from htmlGroceryContainer because after delete request the collection can be empty
        htmlGroceryContainer.classList.remove("show-container");
        newItemName.value = "";
        htmlGroceryList.innerHTML = "";
        editFlag = false;
        if (fetchedItems.length > 0) {
          htmlGroceryContainer.classList.add("show-container");
          //We populate the grocery-list with fetched documents
          fetchedItems.forEach((element) => {
            createListItem(element._id, element.item);
          });

          function createListItem(id, value) {
            const element = document.createElement("article");
            let attr = document.createAttribute("data-id");
            attr.value = id;
            element.setAttributeNode(attr);
            element.classList.add("grocery-item");
            element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                      <!-- edit btn -->
                      <button type="button" class="edit-btn fas fa-edit" title="Edit ${value}">
                      </button>
                      <!-- delete btn -->
                      <button type="button" class="delete-btn fas fa-trash" title="Delete ${value}">
                      </button>
                    </div>
                  `;
            // We create edit and delete buttons for every element of the grocery-list

            const editBtn = element.querySelector(".edit-btn");
            //On edit button click we call the editItem function with the parameter of the Article Object that contains the clicked edit button.
            editBtn.addEventListener("click", editHandler);

            const deleteBtn = element.querySelector(".delete-btn");
            //On delete button click we call the deleteItem function with the parameter "data-id" of the clicked delete button's containing Article.
            deleteBtn.addEventListener("click", delHandler);

            htmlGroceryList.appendChild(element);
          }
        }
      });
    }
    reading();

    //Remove edit, delete eventlisteners after every database read
    function editDelListenRemove() {
      const allEditBtns = document.querySelectorAll(".edit-btn");
      const allDelBtns = document.querySelectorAll(".delete-btn");
      if (allEditBtns.length > 0) {
        allEditBtns.forEach((btn) =>
          btn.removeEventListener("click", editHandler)
        );
        allDelBtns.forEach((btn) =>
          btn.removeEventListener("click", delHandler)
        );
      }
    }

    //Create----------------------------------------------------------------
    //On new item creation, we call the createItem function what sends the request with the data to mongodb

    const newItemName = document.querySelector("#grocery");
    const newItemBtn = document.querySelector(".submit-btn");
    newItemBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (newItemName.value !== "") {
        const responseNewItem = await createItem(jwt, newItemName.value);
        if (responseNewItem.statusCode !== 201) {
          displayAlert(responseNewItem.body, "danger");
        } else {
          reading();
          displayAlert("Tétel a listához adva", "success");
        }
      } else {
        displayAlert("Hiányzó tételnév", "danger");
      }
    });

    //Edit------------------------------------------------------------------

    function editHandler(event) {
      if (editFlag) {
        closeEdit(originalValue);
        editFlag = false;
      }
      editItem(event.target.parentElement.parentElement);
    }
    async function editItem(clickedArticle) {
      const itemID = clickedArticle.attributes[0].value; //attribute data-id
      originalValue = clickedArticle.children[0].innerHTML;
      editFlag = true;

      //We change the original paragraph with input, accept and cancel buttons
      openEdit(originalValue, clickedArticle);
      const editInput = document.querySelector("#edit-input");
      editInput.focus();
      document
        .getElementsByClassName("deny-edit")[0]
        .addEventListener("click", () => {
          closeEdit(originalValue);
          editFlag = false;
        });
      const acceptEdit = document.getElementsByClassName("accept-edit")[0];

      acceptEdit.addEventListener("click", async (e) => {
        //Checks if the input value is an empty string
        e.preventDefault();
        if (editInput.value === "") {
          editInput.value = originalValue;
          editInput.focus();
          displayAlert("Hiányzó tétel név", "danger");
        } else {
          //If the edited name is equal as the original name, close the edit
          if (editInput.value === originalValue) {
            closeEdit(originalValue);
            editFlag = false;
            displayAlert("Nem történt változtatás", "success");
          } else {
            //All database entry stored in lowercase
            const lowerEditInput = editInput.value.toLowerCase();
            //Checks if the list already contains the input value
            let contains = false;
            const allItemName = document.querySelectorAll(".title");
            for (let item of allItemName) {
              contains = item.innerHTML === lowerEditInput ? true : false;
              if (contains) break;
            }
            if (contains) {
              editInput.focus();
              displayAlert("Már szerepel a listán", "danger");
            } else {
              //Request the collection update from the MongoDB server with the new name
              const responseEdit = await editDatabase(
                jwt,
                itemID,
                lowerEditInput
              );
              if (responseEdit.statusCode !== 204) {
                displayAlert(responseEdit.body, "danger");
              } else {
                editFlag = false;
                displayAlert("Tétel módosítva", "success");
                reading();
              }
            }
          }
        }
      });
    }

    //Delete---------------------------------------------------------
    function delHandler(event) {
      deleteItem(
        event.target.parentElement.parentElement.attributes[0].value,
        event.target.parentElement.parentElement.firstChild.innerText
      );
    }
    async function deleteItem(itemID, itemName) {
      let text = "";
      if (itemName === "") {
        text = "Biztos törlöd a listát?";
      } else {
        text = `Biztos törlöd a "${itemName}" tételt a listáról?`;
      }
      if (confirm(text)) {
        const responseDel = await deleteDatabase(jwt, itemID);
        if (responseDel.statusCode !== 204) {
          displayAlert(responseDel.body, "danger");
        } else {
          displayAlert("Sikeres törlés", "success");
          reading();
        }
      }
    }
    //Delete All-----------------------------------------------------
    const deleteAllBtn = document.querySelector(".clear-btn");
    deleteAllBtn.addEventListener("click", () => deleteItem("all", ""));
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

// display alert
function displayAlert(text, action) {
  listAlert.textContent = text;
  listAlert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    listAlert.textContent = "";
    listAlert.classList.remove(`alert-${action}`);
  }, 2000);
}
