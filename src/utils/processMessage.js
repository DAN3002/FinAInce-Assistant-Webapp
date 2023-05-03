const processMessage = (message) => {
	message = message.trim();

	// convert enter to \n
	// convert \n to \n

	message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
	// convert spaces to &nbsp;
	message = message.replace(/ /g, '&nbsp;');
	return message;
};

export default processMessage;
