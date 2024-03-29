import React, { useContext } from 'react';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = ({ sidebarOpen }) => {
	const { data } = useContext(ChatContext);
	const { roomName, roomId } = data;

	return (
		<div
			className='chat bg-white transition-transform duration-100 max-w-full'
			style={{ flex: 2 }}>
			<div
				style={{ height: '50px', paddingLeft: sidebarOpen ? '0' : '50px' }}
				className='flex items-center justify-between shadow-sm'>
				<b className=' text-primary-500 pl-5'>{roomName}</b>
				<p style={{ display: 'none' }} className='pr-5'>
					{roomId}
				</p>
				<div className='flex gap-2'>
					{/* <img src={Cam} alt="" />
					<img src={Add} alt="" />
					<img src={More} alt="" /> */}
				</div>
			</div>
			<Messages />
			<Input />
		</div>
	);
};

export default Chat;
