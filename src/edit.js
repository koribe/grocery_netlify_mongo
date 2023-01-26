async function editDatabase(itemID, itemName) {
  const response = await fetch("http://127.0.0.1:4000/edit", {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: itemID, item: itemName }),
  });
  const fetchedRes = await response.json();
  console.log(fetchedRes);
}

export default editDatabase;
