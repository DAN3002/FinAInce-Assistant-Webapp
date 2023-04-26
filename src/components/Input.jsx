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
import handleModel from "../utils/handleModel";

const Input = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const handleSend = async (e) => {
		e.preventDefault();
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
							senderUsername: currentUser.username,
						};
						ChatRooms.sendMessage(data.roomId, message);
					});
				}
			);
		} else if (text) {
			let message = {
				text,
				sender: currentUser.uid,
				timestamp: Timestamp.now(),
				senderUsername: currentUser.username,
			};
			const id = await ChatRooms.sendMessage(data.roomId, message);
			message.id = id;
			handleModel(data.roomId, message, currentUser);
		}

		setText("");
		setImg(null);
	};

	return (
		<div>
			<form className="w-full flex items-center pt-3" onSubmit={handleSend}>
				<div className="shrink flex justify-center px-3">
					<input
						type="file"
						style={{ display: "none" }}
						id="file"
						onChange={(e) => setImg(e.target.files[0])}
					/>
					<label htmlFor="file" className=" cursor-pointer">
						<i className="fa-solid fa-image text-primary-500"></i>
					</label>
				</div>
				<div className="grow">
					<input
						className="w-full outline-none bg-neutral-100 rounded-3xl px-3 py-1 placeholder:text-neutral-600"
						type="text"
						placeholder="Aa"
						onChange={(e) => setText(e.target.value)}
						value={text}
					/>
				</div>
				<div className="shrink flex justify-center px-3">
					<label onClick={handleSend}>
						<i className="fa-solid fa-paper-plane cursor-pointer text-primary-500"></i>
					</label>
				</div>
			</form>
		</div>
	);
};

export default Input;
