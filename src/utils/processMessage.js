export const processMessage = (message) => {
	message = message.trim();

	// convert enter to \n
	// convert \n to \n

	message = message.replace(/(?:\r\n|\r|\n)/g, '\\n');
	// convert spaces to &nbsp;
	// message = message.replace(/ /g, '&nbsp;');
	return message;
};

export const decodeMessage = (message='') => {
	message = message.trim();
	message = message.replace(/\\n/g, '\n');
	message = message.replace(/&nbsp;/g, ' ');

	return message;
};
