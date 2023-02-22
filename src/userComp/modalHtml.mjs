const loginHtml = `<div class="form-container">
<label for="username"><b>Username</b></label>
<input type="text" name="username" required />

<label for="password"><b>Password</b></label>
<input type="password" name="password" required />

<button type="submit" id="login-btn" class="btn modal-btn">Login</button>
</div>

<div class="modal-footer">
<button
  type="button"
  id="register-btn"
  class="btn modal-btn footer-btn"
>
  Register
</button>
</div>`;
const registerHtml = `<div class="form-container">
<label for="username"><b>Username</b></label>
<input type="text" name="username" required />

<label for="password"><b>Password</b></label>
<input type="password" name="password" required />

<label for="password2"><b>Password again</b></label>
<input type="password" name="password2" required />

<label for="regkey"><b>Registration key</b></label>
<input type="text" name="regkey" required />

<button type="submit" id="register-btn" class="btn modal-btn">Register</button>
</div>

<div class="modal-footer">
<button
  type="button"
  id="login-btn"
  class="btn modal-btn footer-btn"
>
  Login
</button>
</div>`;

export { loginHtml, registerHtml };
