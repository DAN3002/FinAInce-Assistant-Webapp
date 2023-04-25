import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: "junctionx-web-app.firebaseapp.com",
	projectId: "junctionx-web-app",
	storageBucket: "junctionx-web-app.appspot.com",
	messagingSenderId: "478198570445",
	appId: "1:478198570445:web:72eeaab7d7665bb75c3884"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
