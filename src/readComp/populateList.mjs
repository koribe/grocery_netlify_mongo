import { htmlGroceryList } from "../../globalVars.mjs";

export default function populateList(id, value) {
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

  htmlGroceryList.appendChild(element);
}
