import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA0vamrH7GiTpGqGf-DGl_7igDQxB0Ghu8",
    authDomain: "flowfi-d88ff.firebaseapp.com",
    projectId: "flowfi-d88ff",
    storageBucket: "flowfi-d88ff.firebasestorage.app",
    messagingSenderId: "1005835173444",
    appId: "1:1005835173444:web:0c9662c1eb37cb6d4bc611",
    measurementId: "G-VRSSHQQWSJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };
