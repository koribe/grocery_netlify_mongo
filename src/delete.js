async function deleteDatabase(itemID) {
  const response = await fetch("http://127.0.0.1:4000/delete", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: itemID }),
  });
  const fetchedRes = await response.json();
  console.log(fetchedRes);
}

export default deleteDatabase;
