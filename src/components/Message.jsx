import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { BOT_DATA, USER_AVA } from "../config"; 

const Message = ({ message, isBot }) => {
	const { currentUser } = useContext(AuthContext);
	const isOwner = message.sender === currentUser.uid;

	const ref = useRef();

	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" });
	}, [message]);

	return (
		<div
			ref={ref}
			className={`message ${isOwner && "owner"}`}
		>
			<div className="messageInfo">
				<img
					src={
						(!isOwner && isBot) ? BOT_DATA.avatar : USER_AVA
					}
					alt=""
				/>
				{/* <span>just now</span> */}
			</div>
			<div className="messageContent">
				<p>{message.text}</p>
				{message.img && <img src={message.img} alt="" />}
			</div>
		</div>
	);
};

export default Message;
