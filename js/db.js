import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
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

    console.log("User data stored successfully");
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
}

export { addUserData };
