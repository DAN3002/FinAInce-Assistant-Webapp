import {
	setDoc,
	doc,
	getDoc,
} from "firebase/firestore";
import {
	db
} from "../firebase";

const Users = {
	async newUser (userId, userData) {
		// create and return new user
		await setDoc(doc(db, "users", userId), userData);

		return {
			uid: userId,
			...userData,
		};
	},
	async getUserById (userId) {
		const userDoc = await getDoc(doc(db, "users", userId));
		return userDoc.data();
	}
}

export default Users;
