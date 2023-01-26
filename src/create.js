async function createItem(newItem) {
  const response = await fetch("http://127.0.0.1:4000/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ item: newItem }),
  });
  const fetchedRes = await response.json();
  console.log(fetchedRes);
}
export default createItem;
