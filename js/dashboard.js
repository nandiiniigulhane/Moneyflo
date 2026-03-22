import {
  getUsername,
  addExpenseData,
  getExpensesData,
  setIncome,
  getIncome,
  getAllCategories,
  addCategory,
  getTotalSpent,
} from "./db.js";

const income = document.getElementById("income");

function replaceAddIncomeToEditIncome() {
  const incomeButton = document.getElementById("submit-income-button");
  if (income.readOnly === true && incomeButton) {
    incomeButton.remove();
  }
}

const username = document.getElementById("username");
getUsername().then((user) => {
  username.textContent = user;
});

getIncome().then((incomeValue) => {
  if (!incomeValue) {
    return;
  }

  income.value = incomeValue;
  income.readOnly = true;

  replaceAddIncomeToEditIncome();

  const incomeButton = document.getElementById("submit-income-button");

  const montlyIncomeStat = document.getElementById("stat-income-display");
  montlyIncomeStat.textContent = "₹ " + incomeValue;

  const remainingStat = document.getElementById("stat-remaining");
  remainingStat.textContent = "₹ " + incomeValue;
});

const totalSpentElement = document.getElementById("user-current-spending");
let totalSpentByUser;
let remainingAmount;

getTotalSpent().then((totalSpent) => {
  totalSpentByUser = totalSpent;
  totalSpentElement.textContent = "₹ " + totalSpent;

  remainingAmount = Number(income.value) - totalSpent;
  const remainingStat = document.getElementById("stat-remaining");
  remainingStat.textContent = "₹ " + remainingAmount;
});

const incomeButton = document.getElementById("submit-income-button");
incomeButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const incomeElement = document.getElementById("income");
  const incomeValue = incomeElement.value;

  if (!incomeValue || incomeValue.trim() === "" || Number(incomeValue) <= 0) {
    alert("add income!");
    return;
  }
  setIncome(incomeElement.value);

  income.readOnly = true;
  const montlyIncomeStat = document.getElementById("stat-income-display");
  montlyIncomeStat.textContent = "₹ " + incomeElement.value;

  const remainingStat = document.getElementById("stat-remaining");
  remainingAmount = incomeValue;
  remainingStat.textContent = incomeElement.value;

  replaceAddIncomeToEditIncome();
});

let categories = new Set();

const categoryButton = document.getElementById("add-category-button");
categoryButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const categoryElement = document.getElementById("categories");
  await addCategory(categoryElement.value);

  if (categories.has(categoryElement.value)) {
    return;
  }
  categories.add(categoryElement.value);
  categoryDropDown(categoryElement.value);
  categoryElement.value = "";
});

const transactionForm = document.getElementById("expense-form");
transactionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const income = await getIncome();
  if (!income) {
    alert("add income first!");
    return;
  }

  const formData = new FormData(transactionForm);
  const transaction = Object.fromEntries(formData.entries());

  let amount = transaction["amount"];
  let description = transaction["description"];
  let category = transaction["category"];
  let date = transaction["date"];

  let parsedDate;

  if (!date || date.trim() === "") {
    parsedDate = new Date();
  } else {
    parsedDate = new Date(date);
  }

  const formattedDate = parsedDate.toLocaleDateString("en-GB");
  date = formattedDate;

  if (!amount || amount.trim() === "" || !category || category.trim() === "") {
    alert("add amount and category!");
    return;
  }

  addExpenseData(amount, description, category, date);
  totalSpentByUser += Number(amount);
  totalSpentElement.textContent = "₹ " + totalSpentByUser;

  const remainingStat = document.getElementById("stat-remaining");
  remainingAmount -= Number(amount);
  remainingStat.textContent = "₹ " + remainingAmount;

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

function categoryDropDown(category) {
  categories.add(category);
  const selectTag = document.getElementById("category");

  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;

  selectTag.appendChild(option);
}

function initCategoriesDropDown() {
  let count = 0;
  getAllCategories().then((categories) => {
    categories.forEach((category) => {
      categoryDropDown(category);
      count++;
    });
  });
}

initLoadingTransactions();
initCategoriesDropDown();
