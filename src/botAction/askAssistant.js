import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";

const askAssistant = async ({
	room, modelRes
}) => {
	const message = modelRes.message.content;
	const suggestions = modelRes.suggestions || [];
	const action = modelRes.action || {};

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

	if (action.params && action.params.chart && action.params.chart.iframeLink) {
		const iframeLink = action.params.chart.iframeLink;
		
		for (const iframe of iframeLink) {
			await ChatRooms.sendBotMessage(room.id, {
				iframe,
			});
		}
	}
}

export default askAssistant;
