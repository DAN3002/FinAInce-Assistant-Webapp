import React, { useContext, useEffect, useRef, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { BOT_DATA, NLP_SERVER } from '../config';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Avatar from '../utils/Avatar';
import bankingAPI from '../api/banking';
import ChatRooms from '../models/ChatRooms';
import handleModel from '../utils/handleModel';
import changeMessageWidth from '../utils/changeMessageWidth';
import { decodeMessage } from '../utils/processMessage';

const Message = ({ message, isBot, hideAvatar, showName, roomId }) => {
	const [transaction, setTransaction] = useState(null);
	const { currentUser } = useContext(AuthContext);
	const isOwner = message.sender === currentUser.uid;

	const ref = useRef();

	const transactionId = message.transactionId;

	useEffect(() => {
		const fn = async () => {
			// await new Promise((r) => setTimeout(r, 300));
			ref.current?.scrollIntoView({ behavior: 'smooth' });
			changeMessageWidth();
		};
		fn();
	}, [message]);

	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(
				doc(db, 'transaction', transactionId),
				(doc) => {
					const transctionData = doc.data();
					setTransaction(transctionData);
				}
			);

			return () => {
				unsub();
			};
		};

		transactionId && getChats();
	}, [transactionId]);

	const handleConfirm = async (transactionData) => {
		const myOTP = await bankingAPI.getOTP();
		const { value: otp } = await Swal.fire({
			title: 'Enter your OTP',
			input: 'text',
			inputLabel: 'Your OTP',
			inputValue: myOTP.data.data,
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return 'You need to enter your OTP first!';
				}
			},
		});

		if (otp) {
			const transaction = {
				username: transactionData.to,
				// fullname: 'test9',
				amount: transactionData.amount,
				message: transactionData.message,
			};
			const transferRes = await bankingAPI.transfer(transaction);
			const tid = transferRes?.data?.data?.tid;

			await bankingAPI.confirmTransfer(tid, otp);
			if (tid) {
				try {
					// set transaction status to comfirmed from firebase
					const docRef = doc(db, 'transaction', message.transactionId);
					await updateDoc(docRef, {
						status: 'confirmed',
					});
					// send message to bot
					ChatRooms.sendBotMessage(roomId, {
						text: transactionData.responseText,
					});
				} catch (e) {
					console.log(e);
				}
			}
		}
	};

	const handleCancel = () => {
		const docRef = doc(db, 'transaction', message.transactionId);
		updateDoc(docRef, {
			status: 'canceled',
		});
	};

	const handleClickSuggestion = async (choice) => {
		const messageData = await ChatRooms.sendMessage(roomId, {
			text: choice,
			sender: currentUser.uid,
			senderUsername: currentUser.username,
			timestamp: new Date().toISOString(),
		});
		// await ChatRooms.hideSuggestions(roomId);
		await handleModel(roomId, messageData, currentUser);
	};
	message.text = decodeMessage(message.text);

	// console.log(BOT_DATA);
	return (
		<div
			ref={ref}
			className={` text-base flex items-end gap-2 mb-1 ${
				isOwner && 'flex-row-reverse'
			}  `}>
			<div className='flex flex-col '>
				{!isOwner &&
					(hideAvatar ? (
						<div className='w-8 h-8'></div>
					) : isBot ? (
						<img
							className='w-8 h-8 rounded-full'
							src={BOT_DATA.photoURL}
							alt='user-avatar'
						/>
					) : (
						<img
							className='w-8 h-8 rounded-full'
							src={
								!isOwner && isBot
									? BOT_DATA.photoURL
									: Avatar.FromName(
											message.senderUsername || 'Unknow user'
									  )
							}
							alt=''
						/>
					))}
			</div>
			<div className={`max-w-80p flex flex-col ${isOwner && 'items-end'}`}>
				{showName && !isOwner && (
					<span className=' text-neutral-500 text-xs pl-3 pb-1 pt-2'>
						{message.senderUsername || 'Unknown user'}
					</span>
				)}
				{message.text && (
					<>
						<div
							className={`${
								isOwner ? 'bg-primary-500 text-white' : 'bg-neutral-200'
							} px-3 py-2 rounded-3xl gap-2 w-fit max-w-full break-words`}
							style={{
								inlineSize: 'auto',
							}}>
							<ReactMarkdown
								children={message.text}
								remarkPlugins={[remarkGfm]}
							/>
							{/* {message.text} */}
							{message.transactionId &&
								transaction &&
								transaction.status === 'pending' && (
									<div
										key={message.transactionId}
										className='flex justify-center around pt-5'>
										<div
											className='flex justify-around gap-2'
											style={{
												maxWidth: '100%',
												minWidth: '50%',
											}}>
											<button
												className='px-5 py-1 bg-primary-500 text-white rounded-lg'
												onClick={() => handleConfirm(transaction)}>
												<span className='font-semibold'>
													Confirm
												</span>
											</button>
											<button
												className='px-5 py-1 bg-white border-2 text-primary-500 border-primary-500 rounded-lg'
												onClick={handleCancel}>
												<span className='font-semibold'>
													Cancel
												</span>
											</button>
										</div>
									</div>
								)}
						</div>
						<>
							{message.suggestion &&
								!message.suggestion.clicked &&
								message.suggestion.choices.map((suggestion) => {
									if (suggestion.text && suggestion.value) {
										return (
											<button
												key={suggestion}
												className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
												onClick={() =>
													handleClickSuggestion(suggestion.value)
												}>
												{suggestion.text}
											</button>
										);
									} else {
										return (
											<button
												key={suggestion}
												className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
												onClick={() =>
													handleClickSuggestion(suggestion)
												}>
												{suggestion}
											</button>
										);
									}
								})}
						</>
					</>
				)}
				{message.iframe && (
					<iframe
						className='w-full h-96'
						src={NLP_SERVER + message.iframe}
						title='description'
						style={{
							width: '980px',
							height: '605px',
						}}>
						Loading...
					</iframe>
				)}
				{message.img && (
					<img src={message.img} className='w-1/4 rounded-3xl' alt='' />
				)}
				{/* <div
					style={{
						marginBottom: '10px',
					}}
				>
					{message.newsData &&
						message.newsData.map((news) => (
							<div
								className='max-w-sm rounded overflow-hidden shadow-lg'
								style={{
									maxWidth: '20%',
									display: 'inline-block',
									paddingRight: '10px',
								}}>
								<img
									className='w-full'
									// src={news.banner_image}
									src='https://v1.tailwindcss.com/img/card-top.jpg'
									alt='Sunset in the mountains'
									style={{}}
								/>
								<div className='px-6 py-4'>
									<div className='font-bold text-xl mb-2'>
										{news.title}
									</div>
									<p className='text-gray-700 text-base'
										style={{
											maxWidth: '150px',
											overflow: 'hidden',
										}}
									>
										{news.summary}
									</p>
								</div>
							</div>
						))}
				</div> */}
			</div>
		</div>
	);
};

export default Message;
