import { auth } from "./firebase.js";
import { addUserData } from "./db.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

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
    const form = Object.fromEntries(loginFormData.entries());

    const email = form["login-email"];
    const password = form["login-password"];

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let uid = userCredential.user.uid;
        localStorage.setItem("uid", uid);
        alert("Login successfully done!");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

export { registerUser, loginUser };
