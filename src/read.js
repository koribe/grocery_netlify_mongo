async function readData() {
  const response = await fetch("http://127.0.0.1:4000/read");
  const fetchedItems = await response.json();
  if (fetchedItems) {
    return fetchedItems;
  }
}

export default readData;
