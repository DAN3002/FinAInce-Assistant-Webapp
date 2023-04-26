export default function extractPrompt(text) {
	console.log(text);
	// const text = "TRANSFER_MONEY[from=you,to=Minh,amount=30,msg=Trả tiền ăn sáng]";
	const pattern = /(\w+)\[(\w+)=([\w\s]+),(\w+)=([\w\s]+),(\w+)=([\w\s]+),?(\w*)=?(.*)?\]/;

	const startIndex = text.indexOf("TRANSFER_MONEY[");
	if (startIndex !== -1) {
		const match = text.slice(startIndex).match(pattern);
		if (match) {
			const [, command, param1, value1, param2, value2, param3, value3, param4, value4] = match;

			const action = {
				command: command,
				params: {
					[param1]: value1.trim(),
					[param2]: value2.trim(),
					[param3]: value3.trim(),
				},
			};

			if (value4) {
				action.params[param4] = value4.trim();
			}

			const intent = command;


			const result = {
				action: action,
				intent: intent,
				message: {},
			};

			return result;
		} else {
			return {};
		}
	}
}
