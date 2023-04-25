import axios from 'axios';
const API_URLS = {
	createUser: '/user/create',
	login: '/user/login',
};

const axiosInstance = axios.create({
	baseURL: 'https://be.bohocdi.works/api',
});

const api = {
	createUser: (userData) => {
		return axiosInstance.post(API_URLS.createUser, userData);
	},
	login: (userData) => {
		return axiosInstance.post(API_URLS.login, userData);
	}
}

export default api ;
