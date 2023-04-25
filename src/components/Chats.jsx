import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { BOT_DATA } from "../config";

const Chats = () => {
	const [chats, setChats] = useState([]);

	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);

	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
				// Sort that to keep Chat Bot alway on top (check by uid)
				const data = Object.entries(doc.data())?.sort((a,b) => {
					if (b[1].userInfo.uid === BOT_DATA.uid) {
						return 1;
					}

					if (a[1].userInfo.uid === BOT_DATA.uid) {
						return -1;
					}


					return b[1].date - a[1].date;
				});

				setChats(data);
			});

			return () => {
				unsub();
			};
		};

		currentUser.uid && getChats();
	}, [currentUser.uid]);

	const handleSelect = (u) => {
		dispatch({ type: "CHANGE_USER", payload: u });
	};

	return (
		<div className="chats">
			{chats.map((chat) => (
				<div
					className="userChat"
					key={chat[0]}
					onClick={() => handleSelect(chat[1].userInfo)}
				>
					<img src={chat[1].userInfo.photoURL} alt="" />
					<div className="userChatInfo">
						<span>{chat[1].userInfo.displayName}</span>
						<p>{chat[1].lastMessage?.text}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default Chats;
