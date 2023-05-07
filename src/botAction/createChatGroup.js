import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";
import createGroup from "../utils/CreateGroup";

const checkBalance = async ({
	room,
	modelRes,
	currentUser
}) => {
	const {
		action,
		message,
	} = modelRes;

	let users = [
		currentUser.username,
	]
	users = users.concat(action.params.members);
	await createGroup(users);

	const botText = message && message.content ? message.content : `
		Group created!
	`

	await ChatRooms.sendMessage(room.id, {
		text: botText,
		sender: BOT_DATA.uid,
		senderUsername: BOT_DATA.username,
		createdAt: new Date(),
	});
}

export default checkBalance;
