import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { useState } from "react";

const Home = () => {
	let [sidebarOpen, setSidebarOpen] = useState(true);

	const triggerSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<div className="home h-screen bg-gray-200">
			<div className="home-container flex overflow-hidden relative">
				<div
					className={`transition-transform duration-100 h-full sidebar-collapse ${
						sidebarOpen ? " translate-x-0" : " -translate-x-full absolute"
					}`}
					// style={{ maxWidth: "45%" }}
				>
					<Sidebar
						triggerSidebar={triggerSidebar}
					/>
					<div
						className="absolute top-0 bg-primary-500"
						style={{
							height: "50px",
							width: "50px",
							right: sidebarOpen ? "0" : "-50px",
							borderBottomRightRadius: sidebarOpen ? "0" : "10px",
							// borderTopRightRadius: "10px",
						}}
						onClick={triggerSidebar}
					>
						<div className="flex w-full h-full justify-center items-center text-xl text-white">
							<i className="fa-solid fa-right-left"></i>
						</div>
					</div>
				</div>
				<Chat sidebarOpen={sidebarOpen} />
			</div>
		</div>
	);
};

export default Home;
