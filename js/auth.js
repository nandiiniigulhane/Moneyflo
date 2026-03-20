import { auth } from "./firebase.js";
import { addUserData } from "./db.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

let uid = "";

function registerUser(registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const registerFormData = new FormData(registerForm);
      const object = Object.fromEntries(registerFormData.entries());

      const name = object["register-name"];
      const email = object["register-email"];
      const password = object["register-password"];
      const mobileNumber = object["mobile-number"];

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      uid = userCredential.user.uid;
      await addUserData(uid, email, name, mobileNumber);
      alert("Account created successfully!");
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
    const object = Object.fromEntries(loginFormData.entries());

    const email = object["login-email"];
    const password = object["login-password"];

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successfully done!");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

export { registerUser, loginUser };
