async function deleteDatabase(itemID) {
  const request = await fetch("/.netlify/functions/db_read", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: itemID }),
  });
}

export default deleteDatabase;
