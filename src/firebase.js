import {
	initializeApp
} from "firebase/app";
import {
	getAuth
} from "firebase/auth";
import {
	getStorage
} from "firebase/storage";
import {
	getFirestore
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: "juntion-test.firebaseapp.com",
	projectId: "juntion-test",
	storageBucket: "juntion-test.appspot.com",
	messagingSenderId: "573952321105",
	appId: "1:573952321105:web:22bdafa4934350018bfa70",
	measurementId: "G-N81YWTPY70"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
