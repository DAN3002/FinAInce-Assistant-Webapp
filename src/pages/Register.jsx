import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { BOT_DATA } from '../config';
import ChatRooms from '../models/ChatRooms';
import Users from '../models/Users';
import bankingAPI from '../api/banking';
import handleModel from '../utils/handleModel';
import showLoading from '../utils/showLoading';
import Swal from 'sweetalert2';

const Register = () => {
	const [err, setErr] = useState(false);
	// const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		// setLoading(true);
		e.preventDefault();
		showLoading();

		const email = e.target[0].value;
		const username = e.target[1].value;
		const fullName = e.target[2].value;
		const phoneNumber = e.target[3].value;
		const password = e.target[4].value;
		// const file = e.target[5].files[0];

		try {
			//Create user
			const res = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const userData = {
				username: username,
				fullname: fullName,
				phone_number: phoneNumber,
				email: email,
				password: password,
			};

			await bankingAPI.createUser(userData);
			const user = await Users.newUser(res.user.uid, userData);
			const newBotRoom = await ChatRooms.newChatRoom([user, BOT_DATA], true);

			// Send welcome message by bot
			// ChatRooms.sendMessage(newBotRoom.id, {
			// 	text: "Welcome to the Chat!",
			// 	timestamp: new Date().getTime(),
			// 	sender: BOT_DATA.uid,
			// 	senderUsername: "Chat Bot",
			// });
			await handleModel(newBotRoom.id, null, user);
			Swal.close();
			navigate('/');
		} catch (err) {
			Swal.close();
			setErr(true);
			console.log(err);
			// close all swal
			// setLoading(false);

			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: err.message,
			});
		}
	};

	return (
		<div className='w-screen h-screen flex items-center justify-center'>
			<div className='flex flex-col bg-primary-50 rounded-xl p-5 gap-2 w-1/3'>
				<span className='text-primary-500 font-extrabold text-center text-3xl'>
					FinAInce Assistant
				</span>
				<span className='title text-primary-300 text-xl'>Register</span>
				<form onSubmit={handleSubmit} className='flex flex-col gap-3'>
					<input
						className='p-3 border-none outline-none bg-white'
						required
						type='email'
						placeholder='Email'
					/>
					<input
						className='p-3 border-none outline-none bg-white'
						required
						type='text'
						placeholder='Username'
					/>
					<input
						className='p-3 border-none outline-none bg-white'
						required
						type='text'
						placeholder='Full Name'
					/>
					{/* add validate */}
					<input
						className='p-3 border-none outline-none bg-white'
						required
						type='text'
						placeholder='Phone Number'
						pattern='^(\+)?(0|1)?[0-9]{10,14}$'
					/>
					<input
						className='p-3 border-none outline-none bg-white'
						required
						type='password'
						placeholder='Password'
					/>

					<button className='bg-primary-500 p-2 border-none cursor-pointer text-white'>
						Sign up
					</button>
					{/* <input
						required
						style={{ display: 'none' }}
						type='file'
						id='file'
					/>
					<label htmlFor='file'>
						<img src={Add} alt='' />
						<span>Add an avatar</span>
					</label>
					{loading && 'Uploading and compressing the image please wait...'} */}
					{err && (
						<span className='text-primary-500'>Something went wrong</span>
					)}
				</form>
				<p>
					You do have an account?{' '}
					<Link className='text-primary-300' to='/register'>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
