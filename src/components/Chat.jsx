import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = ({ sidebarOpen, triggerSidebar }) => {
	const { data } = useContext(ChatContext);
	const { roomName } = data;

	return (
		<div
			className="chat bg-white transition-transform duration-100 max-w-full"
			stype={{ flex: 2 }}
		>
			<div
				style={{ height: "50px", paddingLeft: sidebarOpen ? "0" : "50px" }}
				className="flex items-center justify-between shadow-sm"
			>
				<b className=" text-primary-500 pl-5">{roomName}</b>
				<div className="flex gap-2">
					{/* <img src={Cam} alt="" />
					<img src={Add} alt="" />
					<img src={More} alt="" /> */}
				</div>
			</div>
			<Messages triggerSidebar={triggerSidebar} />
			<Input />
		</div>
	);
};

export default Chat;
