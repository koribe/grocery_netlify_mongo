async function editDatabase(itemID, itemName) {
  const request = await fetch("/.netlify/functions/db_read", {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: itemID, item: itemName }),
  });
}

export default editDatabase;
