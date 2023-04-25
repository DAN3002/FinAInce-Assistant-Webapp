import React, { useState } from 'react';
import Add from '../img/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import bankingAPI from '../api/banking';

const Register = () => {
	const [err, setErr] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		const email = e.target[0].value;
		const displayName = e.target[1].value;
		const fullName = e.target[2].value;
		const phoneNumber = e.target[3].value;
		const password = e.target[4].value;
		const file = e.target[5].files[0];

		try {
			//Create user
			const res = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const userData = {
				username: displayName,
				fullname: fullName,
				phone_number: phoneNumber,
				email: email,
				password: password,
			};

			bankingAPI.createUser(userData);
			//Create a unique image name
			const date = new Date().getTime();
			const storageRef = ref(storage, `${displayName + date}`);

			await uploadBytesResumable(storageRef, file).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					try {
						//Update profile
						await updateProfile(res.user, {
							displayName,
							photoURL: downloadURL,
						});
						//create user on firestore
						await setDoc(doc(db, 'users', res.user.uid), {
							uid: res.user.uid,
							displayName,
							email,
							photoURL: downloadURL,
						});

						//create empty user chats on firestore
						await setDoc(doc(db, 'userChats', res.user.uid), {});
						navigate("/");
					} catch (err) {
						console.log(err);
						setErr(true);
						setLoading(false);
					}
				});
			});
		} catch (err) {
			setErr(true);
			setLoading(false);
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

					<input
						required
						style={{ display: 'none' }}
						type='file'
						id='file'
					/>
					<label htmlFor='file'>
						<img src={Add} alt='' />
						<span>Add an avatar</span>
					</label>
					<button disabled={loading}>Sign up</button>
					{loading && 'Uploading and compressing the image please wait...'}
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
