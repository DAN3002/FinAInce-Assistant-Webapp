import { onSnapshot, collection } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { BOT_DATA, USER_AVA } from '../config';
import Avatar from '../utils/Avatar';

const Chats = ({triggerSidebar}) => {
	const [rooms, setRooms] = useState([]);

	const { currentUser } = useContext(AuthContext);
	const { data, dispatch } = useContext(ChatContext);

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

			const unsub = onSnapshot(
				collection(db, 'chatRooms'),
				(querySnapshot) => {
					const allRoom = querySnapshot.docs.map((doc) => {
						return { id: doc.id, ...doc.data() };
					});

					// Filter room contain current.uid as member
					const data = allRoom
						.filter((el) => {
							return el.members.find(
								(member) => member.uid === currentUser.uid
							);
						})
						.sort((a, b) => {
							if (a.isBot) {
								return -1;
							}

							if (b.isBot) {
								return 1;
							}

							return (
								(b.lastMessage?.timestamp || 0) -
								(a.lastMessage?.timestamp || 0)
							);
						});

					setRooms(data);
				}
			);

			return () => {
				unsub();
			};
		};

		currentUser.uid && getChats();
	}, [currentUser.uid]);

	const handleSelect = (roomId, roomName) => {
		dispatch({ type: 'CHANGE_USER', payload: { roomId, roomName } });
		triggerSidebar();
	};
  // console.log(rooms);

	return (
		<div className='chats overflow-scroll h-auto'>
			{rooms.map((room) => {
				let roomName = room.name;
				if (!roomName && room.type === 'private') {
					roomName = room.members.find(
						(member) => member.uid !== currentUser.uid
					).username;
				}

				const photo = room.isBot
					? BOT_DATA.photoURL
					: Avatar.FromName(roomName);

				return (
					<div
						className={`cursor-pointer flex py-2 px-4 justify-between hover:bg-neutral-100 gap-2 ${
							data.roomId === room.id
								? 'bg-neutral-200 shadow-sm'
								: 'bg-white'
						}`}
						key={room.id}
						onClick={() => handleSelect(room.id, roomName)}>
						<img className='w-10 h-10 rounded-full' src={photo} alt='' />

						<div className='flex flex-grow flex-col w-3/4'>
							<b className='truncate'>{roomName}</b>
							<span className='text-neutral-400 truncate'>
								{room.lastMessage?.text}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Chats;
