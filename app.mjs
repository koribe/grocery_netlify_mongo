import readData from "./src/read.js";
import createItem from "./src/create.js";
import editDatabase from "./src/edit.js";
import deleteDatabase from "./src/delete.js";
import { openEdit, closeEdit } from "./src/functions/editInput.js";

const htmlGroceryContainer = document.querySelector(".grocery-container");
const htmlGroceryList = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");

let editFlag = false;
let originalValue = "";

let username = getUsername();
if (username) {
  //Read-------------------------------------------------------
  //When page is loading and after every database operation, we fetch the data from mongodb
  async function reading() {
    readData(username).then((fetchedItems) => {
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
                      <button type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                      <!-- delete btn -->
                      <button type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  `;
          // We create edit and delete buttons for every element of the grocery-list

          const editBtn = element.querySelector(".edit-btn");
          //On edit button click we call the editItem function with the parameter of the Article Object that contains the clicked edit button.
          editBtn.addEventListener("click", () => {
            if (editFlag) {
              closeEdit(originalValue);
              editFlag = false;
            }
            editItem(editBtn.parentElement.parentElement);
          });

          const deleteBtn = element.querySelector(".delete-btn");
          //On delete button click we call the deleteItem function with the parameter "data-id" of the clicked delete button's containing Article.
          deleteBtn.addEventListener("click", () =>
            deleteItem(
              deleteBtn.parentElement.parentElement.attributes[0].value
            )
          );

          htmlGroceryList.appendChild(element);
        }
      }
    });
  }
  reading();

  //Create----------------------------------------------------------------
  //On new item creation, we call the createItem function what sends the request with the data to mongodb

  const newItemName = document.getElementById("grocery");
  const newItemBtn = document.querySelector(".submit-btn");
  newItemBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (newItemName.value !== "") {
      newItemCreation();
    } else {
      displayAlert("Hiányzó tételnév", "danger");
    }
  });

  async function newItemCreation() {
    await createItem(newItemName.value);
    displayAlert("Tétel a listához adva", "success");
    reading();
  }

  //Edit-------------------------------------------------------------------
  async function editItem(clickedArticle) {
    const itemID = clickedArticle.attributes[0].value; //attribute data-id
    originalValue = clickedArticle.children[0].innerHTML;
    editFlag = true;

    //We change the original paragraph with input, accept and cancel buttons
    openEdit(originalValue, clickedArticle);
    const editInput = document.getElementById("edit-input");
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
          //Checks if the list already contains the input value
          let contains = false;
          const allItemName = document.getElementsByClassName("title");
          for (let item of allItemName) {
            contains = item.innerHTML === editInput.value ? true : false;
            if (contains) break;
          }
          if (contains) {
            editInput.focus();
            displayAlert("Már szerepel a listán", "danger");
          } else {
            //Request the collection update from the MongoDB server with the new name
            await editDatabase(itemID, editInput.value);
            editFlag = false;
            displayAlert("Tétel módosítva", "success");
            reading();
          }
        }
      }
    });
  }

  //Delete---------------------------------------------------------
  async function deleteItem(itemID) {
    await deleteDatabase(itemID);
    reading();
  }

  //Delete All-----------------------------------------------------
  const deleteAllBtn = document.querySelector(".clear-btn");
  deleteAllBtn.addEventListener("click", () => deleteItem("all"));
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//username request ui
function getUsername() {
  let uname = prompt("Felhasználónév:", "");
  if (!uname) {
    uname = getUsername();
  }
  return uname;
}
