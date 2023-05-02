import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";

const noBotAction = async ({
	room
}) => {
	const botText = `
			Sorry, I can't understand what you want!
		`

	await ChatRooms.sendMessage(room.id, {
		text: botText,
		sender: BOT_DATA.uid,
		senderUsername: BOT_DATA.username,
		createdAt: new Date(),
	});
}

export default noBotAction;
