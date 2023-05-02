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

const Transaction = {
	createNewTransaction: ({amount, msg='', from, to}) => {
		const transctionData = {
			amount,
			from,
			to,
			message: msg,
			status: 'pending',
			timestamp: serverTimestamp(),
		}
		// add doc and return id
		return addDoc(collection(db, 'transaction'), transctionData);
	}
}

export default Transaction;