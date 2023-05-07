import {
	BOT_DATA
} from "../config";
import ChatRooms from "../models/ChatRooms";
import bankAPI from "../api/banking";

const checkBalance = async ({
	room, modelRes
}) => {
	const { message } = modelRes;

	const user = await bankAPI.checkUser();
	const userData = user.data.data;

	const balance = userData.balance.amount;

	const botText = `
		${message.content || 'Your balance is '} ${balance}
	`;

	await ChatRooms.sendMessage(room.id, {
		text: botText,
		sender: BOT_DATA.uid,
		senderUsername: BOT_DATA.username,
		createdAt: new Date(),
	});
}

export default checkBalance;
