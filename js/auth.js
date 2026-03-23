import { auth } from "./firebase.js";
import { addUserData } from "./db.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

function showOrHidePassword(passwordElement, toggleButton) {
  if (passwordElement.type === "password") {
    passwordElement.type = "text";
    toggleButton.textContent = "Hide Password";
  } else {
    passwordElement.type = "password";
    toggleButton.textContent = "Show Password";
  }
}

const passwordElementRegister = document.getElementById("register-password");
const toggleButtonRegister = document.getElementById(
  "toggle-password-register",
);

const passwordElementLogin = document.getElementById("login-password");
const toggleButtonLogin = document.getElementById("toggle-password-login");

if (toggleButtonLogin && passwordElementLogin) {
  toggleButtonLogin.addEventListener("click", (event) => {
    event.preventDefault();
    showOrHidePassword(passwordElementLogin, toggleButtonLogin);
  });
}

if (toggleButtonRegister && passwordElementRegister) {
  toggleButtonRegister.addEventListener("click", (event) => {
    event.preventDefault();
    showOrHidePassword(passwordElementRegister, toggleButtonRegister);
  });
}

function registerUser(registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const registerFormData = new FormData(registerForm);
      const form = Object.fromEntries(registerFormData.entries());

      const name = form["register-name"];
      const email = form["register-email"];
      const password = form["register-password"];
      const mobileNumber = form["mobile-number"];

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      let uid = userCredential.user.uid;
      await addUserData(uid, email, name, mobileNumber);
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

function loginUser(loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const loginFormData = new FormData(loginForm);
    const form = Object.fromEntries(loginFormData.entries());

    const email = form["login-email"];
    const password = form["login-password"];

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let uid = userCredential.user.uid;
        localStorage.setItem("uid", uid);
        localStorage.setItem("isAuthenticated", "true");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

export { registerUser, loginUser };
