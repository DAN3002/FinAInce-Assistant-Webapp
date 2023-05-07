import {
	BOT_DATA
} from "../config";
import Transaction from "../models/Transaction";
import ChatRooms from "../models/ChatRooms";

const transferMoney = async ({
	room, modelRes, currentUser
}) => {
	const {
		action, message
	} = modelRes;

	if (action.params) {
		const {
			amount,
			receiver,
			msg,
			confirmation,
			category,
		} = action.params;

		const transaction = await Transaction.createNewTransaction({
			msg,
			category,
			amount: parseInt(amount),
			to: receiver,
			from: currentUser.username,
			responseText: message.content,
		});

		// const botText = `
		// 	Do you want to transfer ${amount} to ${receiver} with message: ${msg}?
		// `

		const botText = confirmation;
		await ChatRooms.sendMessage(room.id, {
			text: botText,
			sender: BOT_DATA.uid,
			senderUsername: BOT_DATA.username,
			createdAt: new Date(),
			transactionId: transaction.id,
		});
	}
}

export default transferMoney;
