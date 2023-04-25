import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import bankingAPI from "../api/banking";
import Users from "../models/Users";

const Login = () => {
	const [err, setErr] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = e.target[0].value;
		const password = e.target[1].value;

		try {
			const user = await signInWithEmailAndPassword(auth, email, password);

			// Get user data
			const currentUser = await Users.getUser(user.user.uid);
			const { userName } = currentUser;

			const bankingTokenRes = await bankingAPI.login({
				username: userName,
				password: password,
			});

			const token = bankingTokenRes.data.token;
			localStorage.setItem("Banking_token", token);
			navigate("/")
		} catch (err) {
			setErr(true);
		}
	};
	return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">Lama Chat</span>
				<span className="title">Login</span>
				<form onSubmit={handleSubmit}>
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<button>Sign in</button>
					{err && <span>Something went wrong</span>}
				</form>
				<p>You don't have an account? <Link to="/register">Register</Link></p>
			</div>
		</div>
	);
};

export default Login;
