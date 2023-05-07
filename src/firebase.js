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

// read from firebaseConfig.json
import firebaseConfig from "./firebaseConfig.json";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
