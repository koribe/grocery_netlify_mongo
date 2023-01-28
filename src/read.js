async function readData() {
  const response = await fetch("/.netlify/functions/db_read");
  const fetchedItems = await response.json();
  if (fetchedItems) {
    return fetchedItems;
  }
}

export default readData;
