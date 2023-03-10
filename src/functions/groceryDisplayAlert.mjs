export default function groceryDisplayAlert(text, action) {
  if (action === "failed" || action === "danger") {
    const listAlert = document.querySelector("#list-alert");
    listAlert.textContent = text;
    listAlert.classList.add(`alert-danger`);
    // remove alert
    setTimeout(function () {
      listAlert.textContent = "";
      listAlert.classList.remove(`alert-danger`);
    }, 2000);
  }
  if (action === "success") {
    const listAlert = document.querySelector("#list-alert");
    listAlert.textContent = text;
    listAlert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function () {
      listAlert.textContent = "";
      listAlert.classList.remove(`alert-${action}`);
    }, 2000);
  }
}
