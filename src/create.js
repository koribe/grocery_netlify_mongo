async function createItem(newItem) {
  const request = await fetch("/.netlify/functions/db_read", {
    method: "POST",
    body: JSON.stringify({ item: newItem }),
  });
}
export default createItem;
