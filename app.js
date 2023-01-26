import readData from "./src/read.js";
import createItem from "./src/create.js";
import editDatabase from "./src/edit.js";
import deleteDatabase from "./src/delete.js";

const htmlGroceryContainer = document.querySelector(".grocery-container");
const htmlGroceryList = document.querySelector(".grocery-list");

//Read
//Indulasnal alapbol kiolvassuk az adatokat az adatbazisbol és minden egyes adatbázis művelet után újra lefutatjuk ezt a functiont.
async function reading() {
  readData().then((fetchedItems) => {
    htmlGroceryContainer.classList.add("show-container");
    //Kiürítjük a listát, az oldal betöltés utáni adatbázis műveleteket követő, újra kiolvasás miatt.
    htmlGroceryList.innerHTML = "";
    //A fetchelt adatbázis adatokkal felpopuláljuk a listánkat.
    fetchedItems.forEach((element) => {
      createListItem(element.id, element.item);
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
      // Minden listaelemhez hozzáadjuk a módosítás és törlés gombokat.

      const editBtn = element.querySelector(".edit-btn");
      //A módosító gomb megnyomására meghívjuk a függvényt és átadjuk neki magát a gombot tartalmazó Article Object-et.
      editBtn.addEventListener("click", () =>
        editItem(editBtn.parentElement.parentElement)
      );

      const deleteBtn = element.querySelector(".delete-btn");
      //A módosító gomb megnyomására meghívjuk a függvényt és átadjuk neki a gombot tartalmazó Article attribútumában szereplő data-id -t.
      deleteBtn.addEventListener("click", () =>
        deleteItem(deleteBtn.parentElement.parentElement.attributes[0].value)
      );

      htmlGroceryList.appendChild(element);
    }
  });
}
reading();

//Create
//Uj bejegyzesnel elkuldjuk az adatot az adatbazis felé, majd frissitjuk a listat.
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
//Bekérjük a listaelem új nevét a felhasználótól, majd átadjuk az editItemName függvénynek az Article data-id -ját és az új listaelem nevét...
//amely elküldi a szervernek az sql parancsot. Végül újra kiolvassuk az adatbázist.
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
