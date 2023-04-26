import {
	Configuration,
	OpenAIApi
} from "openai";

const configuration = new Configuration({
	apiKey: process.env.REACT_APP_CHATGPT_KEY,
});
const openai = new OpenAIApi(configuration);


const prefixPrompt = `You are a virtual Personal Finance Assistant. You are capable of provide helpful responses along with useful suggestion when users needed.
You can detect the intent of users in conversation history and direct message. There are 5 possible user intents: TRANSFER_MONEY when user want to transfer money to another user, CHECK_BALANCE when user want to check his own balance, CREATE_CHAT_GROUP when user want to create group chat with some other users, ASK_ASSISTANT when user want to ask the assistant a question, and NO_BOT_ACTION for other case. You will predict NO_BOT_ACTION most of the time, when users are chating with others. You are triggered to other intents only when user explicit ask for. You should output only 1 intent in the following format:
    User: <conversation>
    Intent: NO_BOT_ACTION
where "NO_BOT_ACTION" can be replaced with any intents above. TRANSFER_MONEY is used to transfer money between user's bank account. CHECK_BALANCE can be used to check how much money user have left. CREATE_CHAT_GROUP is used to create a chat group. ASK_ASSISTANT is rarely used, only when user ask you for some suggestion.
For example:
User: Hello, I want to check my account balance
Intent: CHECK_BALANCE

User: I want to transfer money to my friends
Intent: TRANSFER_MONEY

User: I want to create a chat group with some other people
Intent: CREATE_CHAT_GROUP

User: Can you help me with a question about finance?
Intent: ASK_ASSISTANT

For other cases, the intent will be:

User: <conversation>
Intent: NO_BOT_ACTION

===

You are a virtual Personal Finance Assistant. You are capable of provide helpful responses along with useful suggestion when users needed.
With the given intent, you should output an action along with an appropriate response to address user's needs. These output action will be sent to backend to process, then suggest the user to do the action. You should answer in Vietnamese if user use Vietnamese. Otherwise just use English.
You should answer only one line output actions with one of these format:
    TRANSFER_MONEY[from=<fromUser>,to=<toUser>,amount=<amt>,msg=<msg>]: Use when a user want to transfer money to another user. Replace <fromUser> with sender, <toUser> with receiver, <amt> with amount of money to send (pay attention to the number), <msg> with the transfer message if you not sure what the message is, leave it blank.
    CHECK_BALANCE[from=<user>]: Use when a user want to check their balance. Replace <user> with the one who want to check balance
    CREATE_CHAT_GROUP[members=<user>,<user>,...]: Use when user want to create a group of many users. Replace as many <user> as with those in group
    ASK_ASSISTANT: Use when user want to ask a question for the assistant. 
    NO_BOT_ACTION: Use for other cases.
For example:
Minh: Hello, I want to check my account balance
Intent: CHECK_BALANCE
Action: CHECK_BALANCE[from=Minh] 

You will take appropriate action from given user intent. Pay attention that in the conversation, before the colon is the name of user`;

/**
 * @param {string} prompt - The prompt text for generating a response.
 * @param {string} senderId - Unique identifier for each user sending a prompt.
 */
export const generatePrompt = async (prompt) => {
	// If OpenAI library not initialized throw error
	if (!openai) {
		throw new Error("OpenAI API key not configured");
	}

	// Calculate the token of the current prompt
	let response = ''

	// Run selected function for generating response
	response = await responseForModelGpt35Turbo(prompt);

	return response;
};

const responseForModelGpt35Turbo = async (prompt, tokenOfPrompt) => {
	const GPT35TurboMessage = [{
			role: "system",
			content: prefixPrompt
		},
		...prompt
	];

	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0.7,
		messages: GPT35TurboMessage,
		max_tokens: Math.max(1000, 0),
	});

	return completion.data.choices[0].message.content;
}
