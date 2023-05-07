import axios from 'axios';
const API_URLS = {
	createUser: '/user/create',
	login: '/user/login',
	transfer: '/balance/transfer',
	balance: '/user/self',
	otp: 'transaction/otp',
	confirm: 'transaction/confirm',
};

const axiosInstance = axios.create({
	baseURL: 'https://be-bhdl.jsclub.me/api',
});

const api = {
	createUser: (userData) => {
		return axiosInstance.post(API_URLS.createUser, userData);
	},
	login: (userData) => {
		return axiosInstance.post(API_URLS.login, userData);
	},
	transfer: (transactionData) => {
		return axiosInstance.post(API_URLS.transfer, transactionData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('Banking_token')}`,
			},
		});
	},
	checkUser: () => {
		return axiosInstance.get(API_URLS.balance, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('Banking_token')}`,
			},
		});
	},
	getOTP: () => {
		return axiosInstance.post(API_URLS.otp, {}, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('Banking_token')}`,
			},
		});
	},
	confirmTransfer: (tid, otp) => {
		return axiosInstance.post(API_URLS.confirm, {
			tid: tid,
			otp: otp,
		}, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem(
						'Banking_token'
					)}`,
			},
		});
	},
}

export default api;
