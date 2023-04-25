import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
	const [roomData, setRoomData] = useState({
		messages: [],
		isBot: false,
	});
	const { data } = useContext(ChatContext);

	console.log(data.roomId);

	

	useEffect(() => {
		if (data.roomId) {
			const unSub = onSnapshot(doc(db, "chatRooms", data.roomId), (doc) => {
				doc.exists() && setRoomData(doc.data());
			});
	
			return () => {
				unSub();
			};
		}
	}, [data.roomId]);

	// console.log(messages)
	return (
		<div className="messages">
			{roomData.messages.map((m) => (
				<Message message={m} key={m.id} isBot={roomData.isBot} />
			))}
		</div>
	);
};

export default Messages;
