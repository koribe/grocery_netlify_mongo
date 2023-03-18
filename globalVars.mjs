const htmlGroceryContainer = document.querySelector(".grocery-container");
const htmlGroceryList = document.querySelector(".grocery-list");
const listAlert = document.querySelector("#list-alert");
const logoutCont = document.querySelector("#logout-container");
const newItemName = document.querySelector("#grocery");
const newItemBtn = document.querySelector(".submit-btn");
const deleteAllBtn = document.querySelector(".clear-btn");
const groceryLoad = document.querySelector("#grocery-load");
const modalLoad = document.querySelector("#modal-load");

let Variables = {
  editFlag: false,
  originalValue: "",
  jwt: "",
};

export {
  htmlGroceryContainer,
  htmlGroceryList,
  listAlert,
  logoutCont,
  newItemName,
  newItemBtn,
  deleteAllBtn,
  groceryLoad,
  modalLoad,
  Variables,
};
