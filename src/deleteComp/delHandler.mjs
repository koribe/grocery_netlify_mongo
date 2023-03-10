import deleteItem from "./deleteItem.mjs";
import groceryDisplayAlert from "../functions/groceryDisplayAlert.mjs";
import dbRead from "../readComp/dbRead.mjs";
export default async function delHandler(e) {
  const deleteResponse = await deleteItem(
    e.target.parentElement.parentElement.attributes[0].value,
    e.target.parentElement.parentElement.firstChild.innerText
  );
  groceryDisplayAlert(deleteResponse.body, deleteResponse.status);
  if (deleteResponse.status === "success") dbRead();
}
