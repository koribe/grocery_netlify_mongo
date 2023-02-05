const openEdit = (originalValue, clickedArticle) => {
  //Change the title paragraph with edit input
  const addEditInput = document.createElement("input");
  addEditInput.id = "edit-input";
  addEditInput.type = "text";
  addEditInput.value = originalValue;
  clickedArticle.children[0].innerHTML = "<form></form>";
  clickedArticle.children[0].firstChild.appendChild(addEditInput);
  clickedArticle.children[0].firstChild.insertAdjacentHTML(
    "beforeend",
    `<button type="submit" class="edit-btn accept-edit">
     <i class="fa fa-check"></i>
     </button>
     <button type="button" class="delete-btn deny-edit">
     <i class="fa fa-times"></i>
    </button>`
  );
};

//Change the edit input back to original paragraph
const closeEdit = (originalValue) => {
  const closeEditInput = document.getElementById("edit-input");
  closeEditInput.parentNode.parentNode.innerHTML = originalValue;
};

export { openEdit, closeEdit };
