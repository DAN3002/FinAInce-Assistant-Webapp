import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";
import createGroup from "../utils/CreateGroup";

const checkBalance = async ({
	room, modelRes, currentUser
}) => {
	const {
		action
	} = modelRes;

	let users = [
		currentUser.username,
	]
	users = users.concat(action.params[0]);
	await createGroup(users);
	
	const botText = `
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
