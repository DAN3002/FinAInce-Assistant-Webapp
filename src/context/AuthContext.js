import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Users from "../models/Users";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async(user) => {
			if (!user) {
				setCurrentUser(null);
				return;
			}

			const currentUser = await Users.getUserById(user.uid);

			setCurrentUser({
				uid: user.uid,
				...currentUser
			});
		});

		return () => {
			unsub();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
};
