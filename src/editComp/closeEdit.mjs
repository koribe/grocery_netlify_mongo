//Change the edit input back to original paragraph
export default function closeEdit(originalValue) {
  const closeEditInput = document.getElementById("edit-input");
  closeEditInput.parentNode.parentNode.innerHTML = originalValue;
}
