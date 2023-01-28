async function readData() {
  try {
    const response = await fetch("/.netlify/functions/db_read");
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `MongoDB read function fetch error: ${response.statusText}`,
      };
    }
    const fetchedItems = await response.json();
    return fetchedItems;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Handler function error: ${error.message}`,
      }),
    };
  }
}

export default readData;
