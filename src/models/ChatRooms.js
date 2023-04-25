/* eslint-disable no-lone-blocks */
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
import { v4 as uuidv4 } from 'uuid';
import Users from "./Users";

const ChatRooms = {
	ref: collection(db, "chatRooms"),
	async newChatRoom(members, isBot = false) {
		// Check if username is null and update by uid
		const membersData = [];

		for (const member of members) {
			const user = await Users.getUserById(member.uid);
			membersData.push({
				uid: member.uid,
				username: user.username,
			});
		}

		const roomData = {
			messages: [],
			members: membersData,
			type: members.length > 2 ? "group" : "private",
			lastMessage: null,
			isBot,
		}

		const chatRoomName = roomData.type === "group" ? roomData.members.map(member => member.username).join(", ") : '';
		roomData.name = chatRoomName;

		console.log(roomData);

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
		const privateRooms = allRooms.filter(room => room.type === "private" && room.members.every(member => members.some(m => m.uid === member.uid)));

		return privateRooms[0];
	},

	async sendMessage(roomId, messageData) {
		// get doc by id
		const roomRef = doc(db, "chatRooms", roomId);
		const roomDoc = await getDoc(roomRef);

		messageData.id = uuidv4();

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
