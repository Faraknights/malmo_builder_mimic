import { useState } from 'react';
import { Message } from '../enum/Chat';

//
export interface chatProps {
	chatHistory: Message[];
	setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
	addMessage: (message: Message) => void;
	clear: () => void;
}

export const useChat = (): chatProps => {
	const [chatHistory, setChatHistory] = useState<Message[]>([]);

	const addMessage = (message: Message): void => {
		if (message.content) {
			setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
		}
		//setChatHistory(prevChatHistory => [...prevChatHistory, message]);
	};

	const clear = (): void => {
		setChatHistory([]);
	};

	return {
		chatHistory,
		setChatHistory,
		addMessage,
		clear,
	};
};
