import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";

const askAssistant = async ({
	room,
	modelRes
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

	if (action.params && action.params.chart) {
		const chart = action.params.chart;
		const iframeLink = chart.iframeLink || [];

		for (const iframe of iframeLink) {
			await ChatRooms.sendBotMessage(room.id, {
				iframe,
			});
		}

		// check for news
		if (chart.type === 'news') {
			const newsData = chart.data || [];
			await ChatRooms.sendBotMessage(room.id, {
				newsData: newsData.map((news) => {
					return {
						title: news.title,
						url: news.url,
						summary: news.summary,
						banner_image: news.banner_image,
						authors: news.authors,
					}
				})
			});
		}
	}
}

export default askAssistant;
