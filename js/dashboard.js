import {
  getUsername,
  addExpenseData,
  getExpensesData,
  setIncome,
  getIncome,
  getAllCategories,
  addCategory,
  getTotalSpent,
  deleteExpenseDate,
} from "./db.js";

const elements = {
  username: document.getElementById("username"),
  incomeInput: document.getElementById("income"),
  totalSpent: document.getElementById("user-current-spending"),
  remaining: document.getElementById("stat-remaining"),
  incomeDisplay: document.getElementById("stat-income-display"),
  expenseContainer: document.getElementById("expenses-container"),
  categorySelect: document.getElementById("category"),
  categoryInput: document.getElementById("categories"),
  addCategoryBtn: document.getElementById("add-category-button"),
  expenseForm: document.getElementById("expense-form"),
  logoutBtn: document.getElementById("logout-user"),
  incomeBtn: document.getElementById("submit-income-button"),
};

const state = {
  income: 0,
  totalSpent: 0,
  categories: new Set(),
};

function formatCurrency(value) {
  return `₹ ${value}`;
}

function isValidAmount(value) {
  return value && value.trim() !== "" && Number(value) > 0;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB");
}

function getRemaining() {
  return state.income - state.totalSpent;
}

function renderStats() {
  elements.totalSpent.textContent = formatCurrency(state.totalSpent);
  elements.incomeDisplay.textContent = formatCurrency(state.income);
  elements.remaining.textContent = formatCurrency(getRemaining());
}

function enableIncomeEditing() {
  elements.incomeInput.readOnly = false;
  elements.incomeInput.value = "";
  elements.incomeBtn.textContent = "Add Income";
}

async function saveIncome() {
  const value = elements.incomeInput.value;

  if (!isValidAmount(value)) {
    alert("Add valid income!");
    return;
  }

  await setIncome(value);

  state.income = Number(value);
  elements.incomeInput.readOnly = true;
  elements.incomeBtn.textContent = "Edit Income";

  renderStats();
}

function handleIncomeButton() {
  if (elements.incomeInput.readOnly) {
    enableIncomeEditing();
  } else {
    saveIncome();
  }
}

async function handleAddCategory(event) {
  event.preventDefault();

  const category = elements.categoryInput.value.trim();
  if (!category) return;

  if (state.categories.has(category)) return;

  await addCategory(category);
  addCategoryToDropdown(category);

  elements.categoryInput.value = "";
}

function addCategoryToDropdown(category) {
  state.categories.add(category);

  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;

  elements.categorySelect.appendChild(option);
}

async function handleTransactionSubmit(event) {
  event.preventDefault();

  if (!state.income) {
    alert("Add income first!");
    return;
  }

  const formData = new FormData(elements.expenseForm);
  const transaction = Object.fromEntries(formData.entries());

  const amount = transaction.amount;
  const category = transaction.category;
  const description = transaction.description;
  const date = transaction.date
    ? formatDate(transaction.date)
    : formatDate(new Date());

  if (!isValidAmount(amount) || !category) {
    alert("Add amount and category!");
    return;
  }

  try {
    const id = await addExpenseData(amount, description, category, date);

    state.totalSpent += Number(amount);
    renderStats();

    createTransactionCard(id, amount, category, description, date);

    elements.expenseForm.reset();
  } catch (err) {
    alert("Failed to save transaction");
  }
}

function createTransactionCard(id, amount, category, description, date) {
  const card = document.createElement("div");
  card.id = id;

  const amountEl = document.createElement("p");
  amountEl.textContent = amount;
  amountEl.classList.add("card-amount");

  const categoryEl = document.createElement("p");
  categoryEl.textContent = category;
  categoryEl.classList.add("card-category");

  const descriptionEl = document.createElement("p");
  descriptionEl.textContent = description;
  descriptionEl.classList.add("card-description");

  const dateEl = document.createElement("p");
  dateEl.textContent = date;
  dateEl.classList.add("card-date");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Transaction";

  deleteBtn.addEventListener("click", () =>
    deleteTransaction(id, amount, card),
  );

  card.append(amountEl, categoryEl, descriptionEl, dateEl, deleteBtn);
  elements.expenseContainer.appendChild(card);
}

async function deleteTransaction(id, amount, card) {
  await deleteExpenseDate(id);

  card.remove();

  state.totalSpent -= Number(amount);
  renderStats();
}

async function loadUser() {
  const user = await getUsername();
  elements.username.textContent = user;
}

async function loadIncome() {
  const income = await getIncome();
  if (!income) return;

  state.income = Number(income);
  elements.incomeInput.value = income;
  elements.incomeInput.readOnly = true;
  elements.incomeBtn.textContent = "Edit Income";

  renderStats();
}

async function loadTotalSpent() {
  const total = await getTotalSpent();
  state.totalSpent = total;
  renderStats();
}

async function loadTransactions() {
  const transactions = await getExpensesData();

  transactions.forEach((t) => {
    createTransactionCard(t.id, t.amount, t.category, t.description, t.date);
  });
}

async function loadCategories() {
  const categories = await getAllCategories();

  categories.forEach((category) => {
    addCategoryToDropdown(category);
  });
}

function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (!isAuthenticated) {
    window.location.href = "index.html";
  }
}

function logout(event) {
  event.preventDefault();
  localStorage.clear();
  window.location.href = "index.html";
}

function initEventListeners() {
  elements.incomeBtn.addEventListener("click", handleIncomeButton);
  elements.addCategoryBtn.addEventListener("click", handleAddCategory);
  elements.expenseForm.addEventListener("submit", handleTransactionSubmit);
  elements.logoutBtn.addEventListener("click", logout);
}

async function init() {
  checkAuth();
  initEventListeners();

  await loadUser();
  await loadIncome();
  await loadTotalSpent();
  await loadCategories();
  await loadTransactions();
}

init();
