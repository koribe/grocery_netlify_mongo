import { loginHtml, registerHtml } from "./modalHtml.mjs";
import requestLogin from "./requestLogin.mjs";
import requestReg from "./requestReg.mjs";

async function userLogReg() {
  const modalWindow = document.querySelector("#modal-window");
  modalWindow.style.display = "block";
  const modalContent = document.querySelector("#modal-log-reg");
  const modalHeader = document.querySelector(".modal-header > h2");
  const modalAlert = document.querySelector("#modal-alert");
  modalContent.innerHTML = loginHtml;
  let modalFlag = "login";
  let loginBtn = "";
  let regBtn = "";
  queryButtons();

  async function loginHandler(e) {
    if (modalFlag === "login") {
      let inputs = modalContent.querySelectorAll("input");
      let isFormValid = modalContent.checkValidity();
      if (!isFormValid) {
        modalContent.reportValidity();
        displayModalAlert("Hiányzó belépési adatok", "danger");
      } else {
        e.preventDefault();
        const responseLogin = await requestLogin(
          inputs[0].value,
          inputs[1].value
        );
        if (responseLogin.statusCode !== 200) {
          displayModalAlert(responseLogin.body, "danger");
        } else {
          localStorage.setItem("currentloggedin", inputs[0].value);
          localStorage.setItem("authToken", responseLogin.token);
          const authenticatedEvent = new Event("authenticated");
          document.dispatchEvent(authenticatedEvent);
          loginBtn.removeEventListener("click", loginHandler);
          regBtn.removeEventListener("click", registerHandler);
          modalWindow.style.display = "none";
        }
      }
    } else if (modalFlag === "register") {
      modalContent.innerHTML = loginHtml;
      modalHeader.innerHTML = "Login";
      modalFlag = "login";
      queryButtons();
    }
  }

  async function registerHandler(e) {
    if (modalFlag === "register") {
      let inputs = modalContent.querySelectorAll("input");
      let isFormValid = modalContent.checkValidity();
      if (!isFormValid) {
        modalContent.reportValidity();
        displayModalAlert("Hiányzó regisztrációs adatok", "danger");
      } else {
        e.preventDefault();
        if (inputs[1].value !== inputs[2].value) {
          displayModalAlert("Nem egyezik a két jelszó", "danger");
        } else {
          const responseReg = await requestReg(
            inputs[0].value,
            inputs[1].value,
            inputs[3].value
          );
          if (responseReg.statusCode !== 201) {
            displayModalAlert(responseReg.body, "danger");
          } else {
            displayModalAlert("Sikeres regisztráció", "success");
            modalContent.innerHTML = loginHtml;
            modalHeader.innerHTML = "Login";
            modalFlag = "login";
            queryButtons();
          }
        }
      }
    } else if (modalFlag === "login") {
      modalContent.innerHTML = registerHtml;
      modalHeader.innerHTML = "Register";
      modalFlag = "register";
      queryButtons();
    }
  }

  async function queryButtons() {
    if (loginBtn) {
      loginBtn.removeEventListener("click", loginHandler);
      regBtn.removeEventListener("click", registerHandler);
    }
    loginBtn = modalContent.querySelector("#login-btn");
    regBtn = modalContent.querySelector("#register-btn");
    loginBtn.addEventListener("click", loginHandler);
    regBtn.addEventListener("click", registerHandler);
  }

  // display alert
  async function displayModalAlert(text, action) {
    modalAlert.textContent = text;
    modalAlert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function () {
      modalAlert.textContent = "";
      modalAlert.classList.remove(`alert-${action}`);
    }, 2000);
  }
}

export default userLogReg;
