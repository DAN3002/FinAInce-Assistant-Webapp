/* eslint-disable no-lone-blocks */
import {
	doc,
	updateDoc,
	collection,
	addDoc,
	getDocs,
	getDoc,
} from "firebase/firestore";
import {
	db
} from "../firebase";
import {
	v4 as uuidv4
} from "uuid";
import Users from "./Users";
import {
	processMessage
} from "../utils/processMessage";
import {
	BOT_DATA
} from '../config';

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
		};

		const chatRoomName =
			roomData.type === "group" ?
			roomData.members.map((member) => member.username).join(", ") :
			"";
		roomData.name = chatRoomName;

		// console.log(roomData);

		return addDoc(this.ref, roomData);
	},

	async getAllChatRooms() {
		const snapshot = await getDocs(this.ref);
		return snapshot.docs.map((doc) => doc.data());
	},

	async findPrivateChatRoom(members) {
		// find in collection chatGroups
		const allRooms = await this.getAllChatRooms();

		// filter is private and contain 2 members with same uid of members
		const privateRooms = allRooms.filter(
			(room) =>
			room.type === "private" &&
			room.members.length > 0 &&
			room.members.every((member) =>
				members.some((m) => m.uid === member.uid)
			)
		);

		// console.log(privateRooms);
		return privateRooms[0];
	},

	async sendMessage(roomId, messageData) {
		// get doc by id
		const roomRef = doc(db, "chatRooms", roomId);
		const roomDoc = await getDoc(roomRef);

		const id = uuidv4();
		messageData.id = id;

		messageData.text = processMessage(messageData.text || '');

		if (roomDoc.exists()) {
			// push to messages array
			await updateDoc(roomRef, {
				messages: [...roomDoc.data().messages, messageData],
				lastMessage: messageData,
			});

			return messageData;
		}

		return null;
	},

	async getRoomById(roomId) {
		const ref = doc(db, "chatRooms", roomId);
		const docSnap = await getDoc(ref);

		const data = docSnap.data();
		data.id = roomId;
		return data;
	},

	hideSuggestions(roomId) {
		const ref = doc(db, "chatRooms", roomId);
		return updateDoc(ref, {
			'suggestion.clicked': true,
		});
	},

	sendBotMessage(roomId, data) {
		const messageData = {
			...data,
			sender: BOT_DATA.uid,
			senderUsername: BOT_DATA.username,
			createdAt: new Date(),
		}

		return this.sendMessage(roomId, messageData);
	}
};

export default ChatRooms;
