import { registerUser, loginUser } from "./auth.js";

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll(".budget-bar-fill").forEach((el) => {
      el.style.width = el.dataset.width;
      el.style.transition = "width 1.4s cubic-bezier(0.4,0,0.2,1)";
    });
  }, 600);

  document.querySelectorAll(".flip-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const dest = link.getAttribute("href");
      document.body.classList.add("page-flip-out");
      setTimeout(() => {
        window.location.href = dest;
      }, 430);
    });
  });
});

if (sessionStorage.getItem("moneyflo-flip")) {
  sessionStorage.removeItem("moneyflo-flip");
  document.body.classList.add("page-flip-in");
}

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerUser(registerForm);
}

if (loginForm) {
  loginUser(loginForm);
}
