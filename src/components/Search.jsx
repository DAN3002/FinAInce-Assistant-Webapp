import React, { useContext, useState } from "react";
import {
	collection,
	query,
	where,
	getDocs,
	setDoc,
	doc,
	updateDoc,
	serverTimestamp,
	getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

import ChatRooms from "../models/ChatRooms";

const Search = () => {
	const [username, setusername] = useState("");
	const [user, setUser] = useState(null);
	const [err, setErr] = useState(false);

	const { currentUser } = useContext(AuthContext);

	const currentUserBasic = {
		uid: currentUser.uid,
		username: currentUser.username,
	};

	const handleSearch = async () => {
		const q = query(
			collection(db, "users"),
			where("username", "==", username)
		);

		try {
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
			});
		} catch (err) {
			setErr(true);
		}
	};

	const handleKey = (e) => {
		e.code === "Enter" && handleSearch();
	};

	const handleSelect = async () => {
		//check whether the group(chats in firestore) exists, if not create
		const chatRooms = await ChatRooms.findPrivateChatRoom([currentUserBasic, user]);

		if (!chatRooms) {
			// Create a new chat room
			const newChatRoom = await ChatRooms.newChatRoom([currentUserBasic, user]);
			
		}
		// try {
		// 	const res = await getDoc(doc(db, "chats", combinedId));

		// 	if (!res.exists()) {
		// 		//create a chat in chats collection
		// 		await setDoc(doc(db, "chats", combinedId), { messages: [] });

		// 		//create user chats
		// 		await updateDoc(doc(db, "userChats", currentUser.uid), {
		// 			[combinedId + ".userInfo"]: {
		// 				uid: user.uid,
		// 				username: user.username,
		// 				photoURL: user.photoURL,
		// 			},
		// 			[combinedId + ".date"]: serverTimestamp(),
		// 		});

		// 		await updateDoc(doc(db, "userChats", user.uid), {
		// 			[combinedId + ".userInfo"]: {
		// 				uid: currentUser.uid,
		// 				username: currentUser.username,
		// 				photoURL: currentUser.photoURL,
		// 			},
		// 			[combinedId + ".date"]: serverTimestamp(),
		// 		});
		// 	}
		// } catch (err) {}

		setUser(null);
		setusername("")
	};
	return (
		<div className="search">
			<div className="searchForm">
				<input
					type="text"
					placeholder="Find a user"
					onKeyDown={handleKey}
					onChange={(e) => setusername(e.target.value)}
					value={username}
				/>
			</div>
			{err && <span>User not found!</span>}
			{user && (
				<div className="userChat" onClick={handleSelect}>
					<img src={user.photoURL} alt="" />
					<div className="userChatInfo">
						<span>{user.username}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Search;
