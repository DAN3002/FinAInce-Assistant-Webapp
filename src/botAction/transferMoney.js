import {
	BOT_DATA
} from "../config";
import Transaction from "../models/Transaction";
import ChatRooms from "../models/ChatRooms";

const transferMoney = async ({
	room, modelRes, currentUser
}) => {
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
