import React, { useState } from 'react';
// import Add from '../img/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { BOT_DATA } from '../config';
import ChatRooms from '../models/ChatRooms';
import Users from '../models/Users';
import bankingAPI from '../api/banking';

const Register = () => {
	const [err, setErr] = useState(false);
	// const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		// setLoading(true);
		e.preventDefault();
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
			ChatRooms.sendMessage(newBotRoom.id, {
				text: 'Welcome to the Chat!',
				timestamp: new Date().getTime(),
				sender: BOT_DATA.uid,
				senderUsername: 'Chat Bot',
			});


			navigate("/");
		} catch (err) {
			setErr(true);
			console.log(err);
			// setLoading(false);
		}
	};

	return (
		<div className='formContainer'>
			<div className='formWrapper'>
				<span className='logo'>Lama Chat</span>
				<span className='title'>Register</span>
				<form onSubmit={handleSubmit}>
					<input required type='email' placeholder='Email' />
					<input required type='text' placeholder='Display name' />
					<input required type='text' placeholder='Full Name' />
					{/* add validate */}
					<input
						required
						type='text'
						placeholder='Phone Number'
						pattern='^(\+)?(0|1)?[0-9]{10,14}$'
					/>
					<input required type='password' placeholder='Password' />

					<button>Sign up</button>
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
					{err && <span>Something went wrong</span>}
				</form>
				<p>
					You do have an account? <Link to='/register'>Login</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
