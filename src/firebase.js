import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZp-z4hUoHrxnlaNvld3QqAmQT58UOw_A",
    authDomain: "project-joan-v1.firebaseapp.com",
    projectId: "project-joan-v1",
    storageBucket: "project-joan-v1.appspot.com",
    messagingSenderId: "38955326416",
    appId: "1:38955326416:web:2e5428e1b35db884d3f7d5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
