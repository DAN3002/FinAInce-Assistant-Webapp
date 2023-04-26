import React, { useContext, useEffect, useRef, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { BOT_DATA, USER_AVA } from '../config';
import axios from 'axios';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Avatar from '../utils/Avatar';
import bankingAPI from '../api/banking';

const Message = ({ message, isBot, hideAvatar, showName, triggerSidebar }) => {
	const [show, setShow] = useState(true);
	const [transaction, setTransaction] = useState(null);
	const { currentUser } = useContext(AuthContext);
	const isOwner = message.sender === currentUser.uid;

	const ref = useRef();

	const transactionId = message.transactionId;
	
	useEffect(() => {
		const fn = async () => {
			triggerSidebar();
			// await new Promise((r) => setTimeout(r, 300));
			ref.current?.scrollIntoView({ behavior: 'smooth' });
		};
		fn();
	}, [message]);
	
	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, "transaction", transactionId), (doc) => {
				const transctionData = doc.data();
				// console.log(transctionData);
				setTransaction(transctionData);
			});

			return () => {
				unsub();
			};
		};

		transactionId && getChats();
	}, [transactionId]);

	const handleConfirm = async () => {
		const myOTP = await axios.post(
			'https://be.bohocdi.works/api/transaction/otp',
			{},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('Banking_token')}`,
				},
			}
		);
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
				username: 'test9',
				fullname: 'test9',
				amount: 2000,
				message: 'test',
			};
			const transferRes = await bankingAPI.transfer(transaction);

			const tid = transferRes?.data?.data?.tid;

			const res = await axios.post(
				'https://be.bohocdi.works/api/transaction/confirm',
				{
					tid: tid,
					otp: otp,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'Banking_token'
						)}`,
					},
				}
			);

			if (tid) {
				try {
					// set transaction status to comfirmed from firebase
					const docRef = doc(db, 'transaction', message.transactionId);
					updateDoc(docRef, {
						status: 'confirmed',
					});
					removeOptions();
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
		removeOptions();
	};

	const removeOptions = () => {
		setShow(false);
	};

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
					<div
						className={`${
							isOwner ? 'bg-primary-500 text-white' : 'bg-neutral-200'
						} px-3 py-2 rounded-3xl gap-2 w-fit max-w-full break-words`}
						style={{
							inlineSize: 'auto',
						}}>
						{message.text}

						{message.transactionId && transaction && transaction.status === "pending" && (
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
										onClick={handleConfirm}>
										<span className='font-semibold'>Confirm</span>
									</button>
									<button
										className='px-5 py-1 bg-white border-2 text-primary-500 border-primary-500 rounded-lg'
										onClick={handleCancel}>
										<span className='font-semibold'>Cancel</span>
									</button>
								</div>
							</div>
						)}
					</div>
				)}
				{message.img && (
					<img src={message.img} className='w-1/2 rounded-3xl' alt='' />
				)}
			</div>
		</div>
	);
};

export default Message;
