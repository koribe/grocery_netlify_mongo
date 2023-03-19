import { newItemName, Variables, groceryLoad } from "../../globalVars.mjs";
import requestCreate from "../groceryApiCalls/requestCreate.js";
import loadingToggle from "../functions/loadingToggle.mjs";

export default async function createHandler() {
  if (newItemName.value === "")
    return { status: "failed", statusCode: 100004, body: "Hiányzó tételnév" };
  if (newItemName.value.length > 30)
    return { status: "failed", statusCode: 100008, body: "Max. 30 karakter" };
  const allItem = document.querySelectorAll(".title");
  if (allItem.length >= 50)
    return { status: "failed", statusCode: 100007, body: "Max. 50 tétel" };

  const lowerNewItem = newItemName.value.toLowerCase();
  let contains = false;
  for (let item of allItem) {
    contains = item.innerHTML === lowerNewItem ? true : false;
    if (contains) break;
  }
  if (contains)
    return {
      status: "failed",
      statusCode: 100005,
      body: "Már szerepel a listán",
    };
  loadingToggle(groceryLoad); //loading state on
  const responseNewItem = await requestCreate(Variables.jwt, lowerNewItem);
  loadingToggle(groceryLoad); //loading state off
  return responseNewItem;
}
