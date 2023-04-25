import axios from 'axios';
const API_URLS = {
	createUser: '/user/create',
};

const axiosInstance = axios.create({
	baseURL: 'https://be.bohocdi.works/api',
});

const api = {
	createUser: (userData) => {
		// Fetch Post request to create user using fetch
		// return fetch('https://be.bohocdi.works/api/user/create', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify(userData),
		// });
		return axiosInstance.post(API_URLS.createUser, userData);
	}
}

export default api ;
