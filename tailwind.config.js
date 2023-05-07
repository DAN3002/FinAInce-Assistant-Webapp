/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#FEE6EA",
					100: "#FECDD5",
					200: "#FC9CAA",
					300: "#FB6A80",
					500: "#EA0628",
					700: "#95041A",
					800: "#630311",
				},
				secondary: {
					0: "#19191A",
					50: "#F2F2F3",
					100: "#E5E5E6",
					200: "#CACBCE",
					400: "#96979C",
					700: "#4A4B4F",
					900: "#19191A",
				},
			},
		},
	},
	plugins: [],
};
