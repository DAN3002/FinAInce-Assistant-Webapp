import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Avatar from '../utils/Avatar';

const Navbar = () => {
	const { currentUser } = useContext(AuthContext);

	// console.log(currentUser);

	return (
		<div>
			<div
				className='navbar shrink-0 bg-primary-500 flex items-center justify-between text-white'
				style={{
					marginRight: '50px',
				}}>
				<span className='logo'>FinAInce Assistant</span>
				{/* <div className="user flex">
					<img className="w-7 h-7" src={USER_AVA} alt="" />
					<span className="mr-2">{currentUser.username}</span>
					{
						<button onClick={() => signOut(auth)}>
							<i className="fa-solid fa-right-from-bracket"></i>
						</button>
					}
				</div> */}
			</div>
			<div className='flex justify-around items-center py-2'>
				<div>
					<img
						className='w-12 h-12 rounded-full'
						alt=''
						src={Avatar.FromName(currentUser.username)}
					/>
				</div>
				<div className='flex flex-col'>
					<span className='text-xl'>{currentUser.username}</span>
					<span className='text-xs text-neutral-500'>
						{currentUser.phone_number}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
