import {
  getUsername,
  addExpenseData,
  getExpensesData,
  setIncome,
  getIncome,
} from "./db.js";

const username = document.getElementById("username");
getUsername().then((user) => {
  username.textContent = user;
});

const income = document.getElementById("income");
getIncome().then((incomeValue) => {
  income.value = incomeValue;
  const montlyIncomeStat = document.getElementById("stat-income-display");
  montlyIncomeStat.textContent = incomeValue;

  const remainingStat = document.getElementById("stat-remaining");
  remainingStat.textContent = incomeValue;
});

let incomeValue = 0;
let categories = new Set();

const setupForm = document.getElementById("info");
setupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const income = document.getElementById("income");
  incomeValue = income.value;
  setIncome(incomeValue);

  if (incomeValue !== null) {
    income.readOnly = true;
    const montlyIncomeStat = document.getElementById("stat-income-display");
    montlyIncomeStat.textContent = incomeValue;

    const remainingStat = document.getElementById("stat-remaining");
    remainingStat.textContent = incomeValue;
  }

  const categoryElement = document.getElementById("categories");
  categories.add(categoryElement.value);
  categoryElement.value = "";

  const selectTag = document.getElementById("category");
  selectTag.replaceChildren();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;

    selectTag.appendChild(option);
  });
});

const transactionForm = document.getElementById("expense-form");
transactionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (categories.size === 0) {
    alert("first add categories");
  }

  const formData = new FormData(transactionForm);
  const transaction = Object.fromEntries(formData.entries());

  let amount = transaction["amount"];
  let description = transaction["description"];
  let category = transaction["category"];
  let date = transaction["date"];

  addExpenseData(amount, description, category, date);
  transactionCard(amount, category, description, date);
  transactionForm.reset();
});

function transactionCard(amount, category, description, date) {
  const expenseContainer = document.getElementById("expenses-container");
  const cardDiv = document.createElement("div");

  const amountElement = document.createElement("p");
  amountElement.textContent = amount;
  amountElement.classList.add("card-amount");
  cardDiv.appendChild(amountElement);

  const categoryElement = document.createElement("p");
  categoryElement.textContent = category;
  categoryElement.classList.add("card-category");
  cardDiv.appendChild(categoryElement);

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = description;
  descriptionElement.classList.add("card-description");
  cardDiv.appendChild(descriptionElement);

  const dateElement = document.createElement("p");
  dateElement.textContent = date;
  descriptionElement.classList.add("card-date");
  cardDiv.appendChild(dateElement);

  expenseContainer.appendChild(cardDiv);
}

function initLoadingTransactions() {
  getExpensesData().then((transactions) => {
    transactions.forEach((transaction) => {
      transactionCard(
        transaction["amount"],
        transaction["category"],
        transaction["description"],
        transaction["date"],
      );
    });
  });
}

initLoadingTransactions();
