import axios from "axios";

import ChatRooms from '../models/ChatRooms';
import {
	NLP_HISTORY_LIMIT,
	BOT_DATA
} from '../config';
import {
	generatePrompt
} from './openai';
import extractPromptData from '../utils/extractPrompt';

const API_URLS = {
	chat: "/chat",
};


const axiosInstance = axios.create({
	// baseURL: "https://ai.bohocdi.works/api",
	baseURL: "https://ai-bhdl.jsclub.me/api",
	// baseURL: 'http://x.jsclub.me:5000/api',
});

const api = {
	async analysChat(chatMessage, roomId) {
		const body = {
			mock: true,
		};

		const messages = [];
		const room = await ChatRooms.getRoomById(roomId);

		// map userId => username
		const userIdToUsername = {};
		for (const user of room.users) {
			userIdToUsername[user.id] = user.username;
		}

		const messagesFromRoom = Array.from(room.messages);

		// filter to make sure that the chatMessage is end of the conversation
		const thisMessageIndex = messagesFromRoom.findIndex(
			(message) => message.id === chatMessage.id
		);

		// splice to this message index
		messagesFromRoom.splice(thisMessageIndex + 1);

		// Get last NLP_HISTORY_LIMIT messages before this message
		let lastMessages = messagesFromRoom;
		if (NLP_HISTORY_LIMIT > 0) {
			lastMessages = messagesFromRoom.slice(
				Math.max(room.messages.length - NLP_HISTORY_LIMIT, 0)
			);
		}

		for (const message of lastMessages) {
			messages.push({
				content: message.text,
				user: message.sender === BOT_DATA.uid ?
					"Assistant" :
					userIdToUsername[message.sender],
			});
		}

		body.messages = messages;

		// call api
		// const chaGPT = await generatePrompt(messages);
		// return extractPromptData(chaGPT);

		const response = await axiosInstance.post(API_URLS.chat, body, {
			withCredentials: false,
		});
		return response.data;
	},
}

export default api;
