import ChatRooms from "../models/ChatRooms";
import NlpAPI from "../api/nlp";
import {
	checkBalance,
	createChatGroup,
	noBotAction,
	transferMoney,
	askAssistant,
	viewAccountReport
} from '../botAction';

export default async function handleModel(roomId, message, currentUser) {
	const chatRoom = await ChatRooms.getRoomById(roomId);
	if (!chatRoom || !chatRoom.isBot) {
		return;
	}
	const modelRes = await NlpAPI.analysChat(message, roomId);
	const {
		action,
		// message: AIMessgae
	} = modelRes;

	// console.log("=== Model Response ===");
	// console.log(modelRes);

	// if (AIMessgae.content) {
	// 	await ChatRooms.sendMessage(roomId, {
	// 		text: AIMessgae.content,
	// 		sender: BOT_DATA.uid,
	// 		senderUsername: BOT_DATA.username,
	// 		createdAt: new Date(),
	// 	});
	// }

	const params = {
		room: chatRoom,
		modelRes,
		currentUser,
	}

	switch (action.command) {
		case 'TRANSFER':
			await transferMoney(params);
			break;
		case 'CHECK_BALANCE':
			await checkBalance(params);
			break;
		case 'CREATE_CHAT_GROUP':
			await createChatGroup(params);
			break;
		case 'ASK_ASSISTANT':
			await askAssistant(params);
			break;
		case 'VIEW_USER_ACCOUNT_REPORT':
			await viewAccountReport(params);
			break;
		case 'NO_BOT_ACTION':
			await noBotAction(params);
			break;
		default:
			await noBotAction(params);
			break;
	}
};
