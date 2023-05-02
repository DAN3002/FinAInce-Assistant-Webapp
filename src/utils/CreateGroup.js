import ChatRooms from "../models/ChatRooms";
import {db} from "../firebase";
import {collection, getDocs} from "firebase/firestore";

const createGroup = async (usernames) => {
	const members = [];
	const ref = collection(db, "users");
	const docs = await getDocs(ref);
	docs.forEach((doc) => {
		if (usernames.includes(doc.data().username)) {
			members.push({
				uid: doc.id,
				username: doc.data().username,
			});
		}
	});
	const chatRoomRef = ChatRooms.newChatRoom(members, false);
	return chatRoomRef.then((docRef) => {
		return docRef.id;
	});
};

export default createGroup;
