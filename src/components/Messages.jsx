import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const { data } = useContext(ChatContext);

	console.log(data.roomId);

	useEffect(() => {
		if (data.roomId) {
			const unSub = onSnapshot(doc(db, "chatRooms", data.roomId), (doc) => {
				doc.exists() && setMessages(doc.data().messages);
			});
	
			return () => {
				unSub();
			};
		}
	}, [data.roomId]);

	console.log(messages)
	return (
		<div className="messages">
			{messages.map((m) => (
				<Message message={m} key={m.id} />
			))}
		</div>
	);
};

export default Messages;
