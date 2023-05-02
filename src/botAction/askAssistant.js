import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";

const askAssistant = async ({
	room, modelRes, currentUser
}) => {
	const message = modelRes.message.content;
	const suggestions = modelRes.suggestions || [];

	const botText = `
		${message}
	`;

	await ChatRooms.sendMessage(room.id, {
		text: botText,
		sender: BOT_DATA.uid,
		senderUsername: BOT_DATA.username,
		createdAt: new Date(),
		suggestions,
	});
}

export default askAssistant;
