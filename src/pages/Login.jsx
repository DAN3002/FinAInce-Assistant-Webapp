import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

import { auth } from "../firebase";
import bankingAPI from "../api/banking";
import Users from "../models/Users";
import { ChatContext } from "../context/ChatContext";
import showLoading from "../utils/showLoading";

const Login = () => {
	const [err, setErr] = useState(false);
	const navigate = useNavigate();
	const { dispatch } = useContext(ChatContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		showLoading();

		const email = e.target[0].value;
		const password = e.target[1].value;

		try {
			const user = await signInWithEmailAndPassword(auth, email, password);

			// Get user data
			const currentUser = await Users.getUserById(user.user.uid);
			const { username } = currentUser;

			try {
				const bankingTokenRes = await bankingAPI.login({
					username: username,
					password: password,
				});

				const token = bankingTokenRes.data.data.token;
				localStorage.setItem("Banking_token", token);
			} catch (e) {
				console.log(e);
			}
			dispatch({
				type: "CHANGE_USER",
				payload: {}
			});
			Swal.close();
			navigate("/");
		} catch (err) {
			Swal.close();
			console.log(err);
			setErr(true);

			// show error alert
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: err.message,
			});
		}
	};
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="flex flex-col bg-primary-50 rounded-xl p-5 gap-2 w-1/3">
				<span className="text-primary-500 font-extrabold text-center text-3xl">
					BHDL
				</span>
				<span className="title text-primary-300 text-xl">Login</span>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						className="p-3 border-none outline-none bg-white"
						type="email"
						placeholder="email"
					/>
					<input
						className="p-3 border-none outline-none bg-white"
						type="password"
						placeholder="password"
					/>
					<button className="bg-primary-500 p-2 border-none cursor-pointer text-white">
						Sign in
					</button>
					{err && (
						<span className=" text-primary-500">Something went wrong</span>
					)}
				</form>
				<p>
					You don't have an account?{" "}
					<Link className="text-primary-300" to="/register">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
