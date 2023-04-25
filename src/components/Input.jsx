import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
	arrayUnion,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import ChatRooms from "../models/ChatRooms";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const handleSend = async () => {
		if (img) {
			const storageRef = ref(storage, uuid());

			const uploadTask = uploadBytesResumable(storageRef, img);

			uploadTask.on(
				(error) => {
					//TODO:Handle Error
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
						const message = {
							img: downloadURL,
							sender: currentUser.uid,
							timestamp: Timestamp.now(),
						};
						ChatRooms.sendMessage(data.roomId, message);
					});
				}
			);
		} else {
			const message = {
				text,
				sender: currentUser.uid,
				timestamp: Timestamp.now(),
			};
			ChatRooms.sendMessage(data.roomId, message);
		}


		setText("");
		setImg(null);
	};
	return (
		<div className="input">
			<input
				type="text"
				placeholder="Type something..."
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			<div className="send">
				<img src={Attach} alt="" />
				<input
					type="file"
					style={{ display: "none" }}
					id="file"
					onChange={(e) => setImg(e.target.files[0])}
				/>
				<label htmlFor="file">
					<img src={Img} alt="" />
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
};

export default Input;
