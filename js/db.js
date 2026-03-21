import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const collectionName = "users";

async function addUserData(uid, email, name, mobileNumber) {
  try {
    const userRef = doc(db, collectionName, uid);

    const userData = {
      email: email,
      name: name,
      mobileNumber: mobileNumber,
      createdAt: new Date(),
    };

    await setDoc(userRef, userData);
  } catch (error) {
    // throw error;
    alert(error.message);
  }
}

async function addExpenseData(amount, description, category, date) {
  try {
    let uid = localStorage.getItem("uid");

    const transactionCollection = await collection(
      db,
      collectionName,
      uid,
      "transactions",
    );

    const transactionDetail = {
      amount: amount,
      description: description,
      category: category,
      date: date,
    };

    await addDoc(transactionCollection, transactionDetail, { merge: true });
    alert("Transacion added successfully!");
  } catch (error) {
    alert(error.message);
  }
}

async function getExpensesData() {
  try {
    let uid = localStorage.getItem("uid");
    const transactionCollection = await collection(
      db,
      collectionName,
      uid,
      "transactions",
    );

    const transactionSnap = await getDocs(transactionCollection);
    const dataList = transactionSnap.docs.map((doc) => ({
      amount: doc.amount,
      ...doc.data(),
    }));

    return dataList;
    // console.log(dataList);
  } catch (error) {
    alert(error.message);
  }
}

async function getUsername() {
  try {
    let uid = localStorage.getItem("uid");
    const userRef = doc(db, collectionName, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.data().name;
  } catch (error) {
    alert(error.message);
  }
}

async function setIncome(income) {
  try {
    let uid = localStorage.getItem("uid");
    const userRef = doc(db, collectionName, uid);

    await setDoc(userRef, { income: income }, { merge: true });
  } catch (error) {
    alert(error.message);
  }
}

async function getIncome() {
  try {
    let uid = localStorage.getItem("uid");
    const userRef = doc(db, collectionName, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.data().income;
  } catch (error) {
    alert(error.message);
  }
}

export {
  addUserData,
  addExpenseData,
  getUsername,
  getExpensesData,
  setIncome,
  getIncome,
};
