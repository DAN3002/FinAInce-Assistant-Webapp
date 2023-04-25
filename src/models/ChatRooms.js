import {
	setDoc,
	doc,
	updateDoc,
	serverTimestamp,
} from "firebase/firestore";
import {
	db
} from "../firebase";

const ChatRooms = {
	async createNewChatRooms(currentUser, user) {
		// user: User that will be added to the chat room
		// currentUser: Current user
		const combinedId =
			currentUser.uid > user.uid ?
			currentUser.uid + user.uid :
			user.uid + currentUser.uid;

		//create a chat in chats collection
		await setDoc(doc(db, "chats", combinedId), {
			messages: []
		});

		//create user chats
		await updateDoc(doc(db, "userChats", currentUser.uid), {
			[combinedId + ".userInfo"]: {
				uid: user.uid,
				displayName: user.displayName,
				photoURL: user.photoURL,
			},
			[combinedId + ".date"]: serverTimestamp(),
		});

		await updateDoc(doc(db, "userChats", user.uid), {
			[combinedId + ".userInfo"]: {
				uid: currentUser.uid,
				displayName: currentUser.displayName,
				photoURL: currentUser.photoURL,
			},
			[combinedId + ".date"]: serverTimestamp(),
		});
	}
}

export default ChatRooms;
