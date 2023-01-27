async function readData() {
  const results = await fetch("/.netlify/functions/db_read").then((response) =>
    response.json()
  );
  return results;
}

export default readData;
