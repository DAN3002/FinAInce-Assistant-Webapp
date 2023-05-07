import {
	serverTimestamp,
	collection,
	addDoc,
} from "firebase/firestore";
import {
	db
} from "../firebase";

const Transaction = {
	createNewTransaction: ({amount, msg='', from, to, responseText, category}) => {
		const transctionData = {
			amount,
			from,
			to,
			responseText,
			category,
			message: msg,
			status: 'pending',
			timestamp: serverTimestamp(),
		}
		// add doc and return id
		return addDoc(collection(db, 'transaction'), transctionData);
	}
}

export default Transaction;
