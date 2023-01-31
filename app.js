import readData from "./src/read.js";
import createItem from "./src/create.js";
import editDatabase from "./src/edit.js";
import deleteDatabase from "./src/delete.js";

const htmlGroceryContainer = document.querySelector(".grocery-container");
const htmlGroceryList = document.querySelector(".grocery-list");

//Read
//When page is loading and after every database operation, we fetch the data from mongodb
async function reading() {
  readData().then((fetchedItems) => {
    //We remove classlist from htmlGroceryContainer because after delete request the collection can be empty
    htmlGroceryContainer.classList.remove("show-container");
    newItemName.value = "";
    htmlGroceryList.innerHTML = "";
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
        editBtn.addEventListener("click", () =>
          editItem(editBtn.parentElement.parentElement)
        );

        const deleteBtn = element.querySelector(".delete-btn");
        //On delete button click we call the deleteItem function with the parameter "data-id" of the clicked delete button's containing Article.
        deleteBtn.addEventListener("click", () =>
          deleteItem(deleteBtn.parentElement.parentElement.attributes[0].value)
        );

        htmlGroceryList.appendChild(element);
      }
    }
  });
}
reading();

//Create
//On new item creation, we call the createItem function what sends the request with the data to mongodb
async function newItemCreation() {
  await createItem(newItemName.value);
  reading();
}
const newItemName = document.getElementById("grocery");
const newItemBtn = document.querySelector(".submit-btn");
newItemBtn.addEventListener("click", (e) => {
  e.preventDefault();
  newItemCreation();
});

//Edit
//We request the new item name from the user, call the editDatabase function with parameters of
//the edited list item's data-id and the new item name
//After that we read the documents from the collection
async function editItem(clickedArticle) {
  const itemID = clickedArticle.attributes[0].value; //attribute data-id
  const itemName = clickedArticle.children[0].innerHTML;
  const editItemName = prompt("", itemName);
  if (editItemName !== null) {
    await editDatabase(itemID, editItemName);
    reading();
  }
}

//Delete
async function deleteItem(itemID) {
  await deleteDatabase(itemID);
  reading();
}

//Delete All
const deleteAllBtn = document.querySelector(".clear-btn");
deleteAllBtn.addEventListener("click", () => deleteItem("all"));
