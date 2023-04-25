import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

import { USER_AVA } from '../config'

const Navbar = () => {
	const {currentUser} = useContext(AuthContext)

	console.log(currentUser);

	return (
		<div className='navbar'>
			<span className="logo">Lama Chat</span>
			<div className="user">
				<img src={USER_AVA} alt="" />
				<span>{currentUser.username}</span>
				<button onClick={()=>signOut(auth)}>logout</button>
			</div>
		</div>
	)
}

export default Navbar
