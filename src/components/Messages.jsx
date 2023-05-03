import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { BOT_DATA } from "../config";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const { data } = useContext(ChatContext);

	// console.log(data.roomId);

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

	// console.log(messages);
	return (
		<div
			className="messages overflow-scroll"
			style={{
				height: "calc(100% - 110px)",
			}}
		>
			{messages.map((m, i) => (
				<Message
					isBot={m.sender === BOT_DATA.uid}
					message={m}
					key={m.id}
					roomId={data.roomId}
					hideAvatar={
						i + 1 < messages.length && messages[i + 1].sender === m.sender
					}
					showName={i > 0 && messages[i - 1].sender !== m.sender}
				/>
			))}
		</div>
	);
};

export default Messages;
