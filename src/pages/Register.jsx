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

const DEFAULT_AVA_LINK = 'https://firebasestorage.googleapis.com/v0/b/junctionx-web-app.appspot.com/o/user-avatar.png?alt=media&token=53d689d8-96e5-419b-8ea9-39196e33ab6e';

const Register = () => {
	const [err, setErr] = useState(false);
	// const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		// setLoading(true);
		e.preventDefault();
		const email = e.target[0].value;
		const userName = e.target[1].value;
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
				username: userName,
				fullname: fullName,
				phone_number: phoneNumber,
				email: email,
				password: password,
			};

			console.log(res.user.uid)

			await bankingAPI.createUser(userData);
			await Users.newUser(res.user.uid, userData);

			//create empty user chats on firestore
		
			// ChatRooms.createNewChatRooms(res.user, BOT_DATA);
			navigate("/");
		} catch (err) {
			setErr(true);
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
