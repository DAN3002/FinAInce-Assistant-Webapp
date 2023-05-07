import { createContext, useReducer } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
	const INITIAL_STATE = {
		currentRoomId: null,
	};

	const chatReducer = (state, action) => {
		switch (action.type) {
			case 'CHANGE_USER':
				return {
					roomId: action.payload.roomId,
					roomName: action.payload.roomName,
				};
			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

	return (
		<ChatContext.Provider
			value={{
				data: state,
				dispatch,
			}}>
			{' '}
			{children}{' '}
		</ChatContext.Provider>
	);
};
