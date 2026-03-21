import { registerUser, loginUser } from "./auth.js";

const ANIMATION_DELAY = 600;
const PAGE_FLIP_DURATION = 430;
const FLIP_KEY = "moneyflo-flip";

function initBudgetBars() {
  setTimeout(() => {
    document.querySelectorAll(".budget-bar-fill").forEach((el) => {
      const width = el.dataset.width;
      if (!width) return;

      el.style.width = width;
      el.style.transition = "width 1.4s cubic-bezier(0.4,0,0.2,1)";
    });
  }, ANIMATION_DELAY);
}

function initPageTransitions() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".flip-link");
    if (!link) return;

    e.preventDefault();
    const dest = link.getAttribute("href");
    if (!dest) return;

    document.body.classList.add("page-flip-out");

    setTimeout(() => {
      window.location.href = dest;
    }, PAGE_FLIP_DURATION);
  });
}

function handlePageFlipIn() {
  if (sessionStorage.getItem(FLIP_KEY)) {
    sessionStorage.removeItem(FLIP_KEY);
    document.body.classList.add("page-flip-in");
  }
}

function initAuth() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (registerForm) registerUser(registerForm);
  if (loginForm) loginUser(loginForm);
}

initBudgetBars();
initPageTransitions();
handlePageFlipIn();
initAuth();
