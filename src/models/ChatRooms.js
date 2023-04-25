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

const ChatRooms = {
	ref: collection(db, "chatRooms"),
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
				username: user.username,
				photoURL: user.photoURL,
			},
			[combinedId + ".date"]: serverTimestamp(),
		});

		await updateDoc(doc(db, "userChats", user.uid), {
			[combinedId + ".userInfo"]: {
				uid: currentUser.uid,
				username: currentUser.username,
				photoURL: currentUser.photoURL,
			},
			[combinedId + ".date"]: serverTimestamp(),
		});
	},

	newChatRoom(members, isBot = false) {
		const membersId = members.map(member => member.uid);

		const roomData = {
			messages: [],
			members: membersId,
			type: members.length > 2 ? "group" : "private",
			lastMessage: null,
			isBot,
		}

		const chatRoomName = roomData.type === "group" ? roomData.members.map(member => member.username).join(", ") : '';
		roomData.name = chatRoomName;

		return addDoc(this.ref, roomData);
	},

	async getAllChatRooms() {
		const snapshot = await getDocs(this.ref);
		return snapshot.docs.map(doc => doc.data());
	},

	async findPrivateChatRoom(members) {
		// find in collection chatGroups
		const allRooms = await this.getAllChatRooms();

		// filter is private and contain 2 members with same uid of members
		const privateRooms = allRooms.filter(room => room.type === "private" && room.members.includes(members[0].uid) && room.members.includes(members[1].uid));

		return privateRooms[0];
	},

	async sendMessage(roomId, messageData) {
		// get doc by id
		const roomRef = doc(db, "chatRooms", roomId);
		const roomDoc = await getDoc(roomRef);

		if (roomDoc.exists()) {
			// push to messages array
			return await updateDoc(roomRef, {
				messages: [...roomDoc.data().messages, messageData],
				lastMessage: messageData,
			});
		}
	}
}

export default ChatRooms;
