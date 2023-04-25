import { onSnapshot, collection } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { BOT_DATA, USER_AVA } from "../config";

const Chats = () => {
	const [rooms, setRooms] = useState([]);

	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);

	useEffect(() => {
		const getChats = () => {
			// const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
			// 	// Sort that to keep Chat Bot alway on top (check by uid)
			// 	const data = Object.entries(doc.data())?.sort((a,b) => {
			// 		if (b[1].userInfo.uid === BOT_DATA.uid) {
			// 			return 1;
			// 		}

			// 		if (a[1].userInfo.uid === BOT_DATA.uid) {
			// 			return -1;
			// 		}


			// 		return b[1].date - a[1].date;
			// 	});

			// 	setChats(data);
			// });

			const unsub = onSnapshot(collection(db, 'chatRooms'), (querySnapshot) => {
					const allRoom = querySnapshot.docs.map(doc => {
						return { id: doc.id, ...doc.data() };
					});
					
					// Filter room contain current.uid as member
					const data = allRoom
					.filter(el => {
						return el.members.find(member => member.uid === currentUser.uid);
					})
					.sort((a, b) => {
						if (a.isBot) {
							return -1;
						}

						if (b.isBot) {
							return 1;
						}

						return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
					})

					setRooms(data);
			});

			return () => {
				unsub();
			};
		};

		currentUser.uid && getChats();
	}, [currentUser.uid]);

	const handleSelect = (roomId, roomName) => {
		dispatch({ type: "CHANGE_USER", payload: { roomId, roomName } });
	};

	return (
		<div className="chats">
			{rooms.map((room) => {
				let roomName = room.name;
				if (!roomName && room.type === 'private') {
					roomName = room.members.find(member => member.uid !== currentUser.uid).username;
				}

				const photo = room.isBot ? BOT_DATA.photoURL : USER_AVA;
				return (
					<div
						className="userChat"
						key={room.id}
						onClick={() => handleSelect(room.id, roomName)}
					>
						<img src={photo} alt="" />
						<div className="userChatInfo">
							<span>{roomName}</span>
							<p>{room.lastMessage?.text}</p>
						</div>
					</div>
				)
			})}
		</div>
	);
};

export default Chats;
