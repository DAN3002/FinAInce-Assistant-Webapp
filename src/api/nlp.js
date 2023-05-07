import axios from "axios";

import ChatRooms from '../models/ChatRooms';
import {
	NLP_HISTORY_LIMIT,
	BOT_DATA,
	NLP_SERVER
} from '../config';
import {
	decodeMessage
} from '../utils/processMessage';
import bankAPI from './banking';

const API_URLS = {
	chat: "/chat",
};


const axiosInstance = axios.create({
	// baseURL: "https://ai.bohocdi.works/api",
	baseURL: `${NLP_SERVER}/api`,
	// baseURL: 'http://x.jsclub.me:5000/api',
});

const api = {
	async analysChat(chatMessage, roomId) {
		const body = {};

		const messages = [];
		const room = await ChatRooms.getRoomById(roomId);

		// map userId => username
		const userIdToUsername = {};
		for (const user of room.members) {
			userIdToUsername[user.uid] = user.username;
		}

		const messagesFromRoom = Array.from(room.messages);
		let lastMessages = messagesFromRoom;

		if (chatMessage) {
			// filter to make sure that the chatMessage is end of the conversation
			const thisMessageIndex = messagesFromRoom.findIndex(
				(message) => message.id === chatMessage.id
			);

			// splice to this message index
			messagesFromRoom.splice(thisMessageIndex + 1);

			// Get last NLP_HISTORY_LIMIT messages before this message
			if (NLP_HISTORY_LIMIT > 0) {
				lastMessages = messagesFromRoom.slice(
					Math.max(room.messages.length - NLP_HISTORY_LIMIT, 0)
				);
			}
		}

		for (const message of lastMessages) {
			messages.push({
				content: decodeMessage(message.text),
				user: message.sender === BOT_DATA.uid ?
					"Assistant" : userIdToUsername[message.sender],
			});
		}

		body.messages = messages;

		// call api
		// const chaGPT = await generatePrompt(messages);
		// return extractPromptData(chaGPT);

		// get userBalance
		const user = await bankAPI.checkUser();
		const userData = user.data.data;
		const balance = userData.balance.amount;

		body.userBalance = balance;

		const response = await axiosInstance.post(API_URLS.chat, body, {
			withCredentials: false,
		});
		return response.data;
		// return     {
		// 	'action': {
		// 		'command': 'ASK_ASSISTANT',
		// 		'params': {},
		// 	},
		// 	'message': {'role': 'assistant', 'content': 'Sure, I can help you with that. What do you want to ask?'},
		// 	'suggestions': ['Help me create a monthly budget plan', 'Help me calculate my target saving plan', 'Help me detect if a loan is usury or not', 'Help me invest my money', 'Help me pay off my debt']
		// }
	},
}

export default api;
