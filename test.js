function main() {
  if (getJWT()) {
    const authenticatedEvent = new Event("authenticated");
    document.dispatchEvent(authenticatedEvent);
  } else {
    showLoginScreen();
  }
}
function showLoginScreen() {
  onLoginSubmit();
}
function showToDoUI() {}
function saveJWT(jwt) {
  localStorage.setItem("authToken", jwt);
}
function getJWT() {
  return localStorage.getItem("authToken");
}
async function onLoginSubmit() {
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  try {
    const response = await api.login(email, password);
    saveJWT(response.jwt);
    const authenticatedEvent = new Event("authenticated");
    document.dispatchEvent(authenticatedEvent);
  } catch (error) {
    handleLoginError(error);
  }
}
document.addEventListener("authenticated", () => showToDoUI());
