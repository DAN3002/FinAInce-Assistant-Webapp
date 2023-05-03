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

	const messageData = {
		text: botText,
		sender: BOT_DATA.uid,
		senderUsername: BOT_DATA.username,
		createdAt: new Date(),
	}

	if (suggestions.length > 0) {
		messageData.suggestion = {
			choices: suggestions,
			clicked: false,
		};
	}

	await ChatRooms.sendMessage(room.id, messageData);
}

export default askAssistant;
