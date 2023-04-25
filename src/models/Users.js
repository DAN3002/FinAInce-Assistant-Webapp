import {
	setDoc,
	doc,
	updateDoc,
	serverTimestamp,
	collection,
	addDoc,
	getDocs,
	getDoc,
	where,
	query,
} from "firebase/firestore";
import {
	db
} from "../firebase";

const Users = {
	async newUser (userId, userData) {
		await setDoc(doc(db, "users", userId), userData);
		return true;
	},
	async getUserById (userId) {
		const userDoc = await getDoc(doc(db, "users", userId));
		return userDoc.data();
	}
}

export default Users;
