import ChatRooms from "../models/ChatRooms";

const viewAccountReport = async ({
	room,
	currentUser
}) => {
	const username = currentUser.username;
	const iframe = `/chart/transaction?user=${username}`
	await ChatRooms.sendBotMessage(room.id, {
		iframe,
	});
};

export default viewAccountReport;
