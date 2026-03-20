import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx0I8xbKGi76NLA84tarh0lprGWnRQZLA",
  authDomain: "moneyflo-2173b.firebaseapp.com",
  projectId: "moneyflo-2173b",
  storageBucket: "moneyflo-2173b.firebasestorage.app",
  messagingSenderId: "440967891135",
  appId: "1:440967891135:web:651273c3f232b72b50de0a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
