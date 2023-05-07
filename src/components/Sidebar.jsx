import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Sidebar = ({ triggerSidebar }) => {
	return (
		<div className='sidebar h-full flex flex-col bg-white shadow-sm flex-0 relative gap-1'>
			<Navbar />
			<Search />
			<Chats triggerSidebar={triggerSidebar} />
			<div
				className='mt-auto flex justify-center items-center'
				style={{
					minHeight: '30px',
				}}
				onClick={() => signOut(auth)}>
				<div className='bg-primary-500 cursor-pointer py-1 px-3 rounded-xl text-white'>
					Sign out
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
