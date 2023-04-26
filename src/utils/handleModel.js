import ChatRooms from "../models/ChatRooms";
import NlpAPI from "../api/nlp";
import {
	BOT_DATA
} from "../config";
import Transaction from "../models/Transaction";
import bankAPI from "../api/banking";
import createGroup from "../utils/CreateGroup";

export default async function handleModel(roomId, message, currentUser) {
	const chatRoom = await ChatRooms.getRoomById(roomId);
	if (!chatRoom || !chatRoom.isBot) {
		return;
	}
	const modelRes = await NlpAPI.analysChat(message, roomId);
	const {
		intent,
		// message: AIMessgae
	} = modelRes;

	console.log("=== Model Response ===");
	console.log(modelRes);

	// if (AIMessgae.content) {
	// 	await ChatRooms.sendMessage(roomId, {
	// 		text: AIMessgae.content,
	// 		sender: BOT_DATA.uid,
	// 		senderUsername: BOT_DATA.username,
	// 		createdAt: new Date(),
	// 	});
	// }

	if (intent === "TRANSFER_MONEY") {
		const {
			action
		} = modelRes;

		if (action.params) {
			const {
				amount,
				to,
				msg
			} = action.params;

			const transaction = await Transaction.createNewTransaction({
				amount,
				msg,
				to,
				from: currentUser.username
			});

			const botText = `
				Do you want to transfer ${amount} to ${to} with message: ${msg}?
			`
			await ChatRooms.sendMessage(roomId, {
				text: botText,
				sender: BOT_DATA.uid,
				senderUsername: BOT_DATA.username,
				createdAt: new Date(),
				transactionId: transaction.id,
			});

		}
	} else if (intent === 'CHECK_BALANCE') {
		const user = await bankAPI.checkUser();
		const userData = user.data.data;

		const balance = userData.balance.amount;

		const botText = `
			Your balance is ${balance}
		`

		await ChatRooms.sendMessage(roomId, {
			text: botText,
			sender: BOT_DATA.uid,
			senderUsername: BOT_DATA.username,
			createdAt: new Date(),
		});
	} else if (intent === 'CREATE_CHAT_GROUP') {
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

		await ChatRooms.sendMessage(roomId, {
			text: botText,
			sender: BOT_DATA.uid,
			senderUsername: BOT_DATA.username,
			createdAt: new Date(),
		});
	} else if (intent === 'NO_BOT_ACTION') {
		const botText = `
			Sorry, I can't understand what you want!
		`

		await ChatRooms.sendMessage(roomId, {
			text: botText,
			sender: BOT_DATA.uid,
			senderUsername: BOT_DATA.username,
			createdAt: new Date(),
		});
	}
};
