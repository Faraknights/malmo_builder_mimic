import React, { useEffect, useRef, useState } from 'react';
import { chatProps } from '../../classes/Chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import isBase64 from '../../tools/isBase64';
interface chatComponentProps {
	chat: chatProps;
	readOnly: boolean;
	nebula?: boolean;
}

const ChatComponent: React.FC<chatComponentProps> = ({
	chat,
	readOnly,
	nebula,
}) => {
	const chatRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [chat.chatHistory]);

	enum Users {
		ARCHITECT = 'ARCHITECT',
		BUILDER = 'BUILDER ',
		NEBULA = 'NEBULA',
	}

	const [user, setUser] = useState<Users>(Users.ARCHITECT);

	return (
		<div id="chat" className="module">
			<h3>Chat</h3>
			<hr />
			<div ref={chatRef}>
				{chat.chatHistory.map((message, i) => (
					<div key={i}>
						{(i === 0 ||
							message.user !== chat.chatHistory[i - 1].user) && (
							<span className="userName" key={`user-${i}`}>
								{message.user}
							</span>
						)}
						<div key={i} className={`message`}>
							{message.content}
						</div>
					</div>
				))}
			</div>

			{!readOnly && (
				<>
					<hr />
					<div>
						<button
							onClick={() => {
								setUser(
									Object.keys(Users)[
										(Object.keys(Users).findIndex(
											(x) => x === user
										) +
											1) %
											Object.keys(Users).length
									] as Users
								);
							}}
						>
							{user}
						</button>
						<input
							type="text"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									const message = e.currentTarget.value;
									chat.addMessage({
										content: message,
										user: user,
									});

									//const message = chat.chatHistory[chat.chatHistory.length - 1].content
									if (nebula) {
										const runPythonScript = async () => {
											await fetchEventSource(
												'/api/new_message',
												{
													method: 'POST',
													headers: {
														'Content-Type':
															'application/json',
													},
													body: JSON.stringify({
														message,
													}),
													onmessage: async (ev) => {
														let full_message = '';
														if (isBase64(ev.data)) {
															full_message = atob(
																ev.data
															);
														} else {
															full_message =
																ev.data;
														}
														console.log(
															full_message
														);
														chat.addMessage({
															content:
																full_message,
															user: Users.NEBULA,
														});
													},
												}
											);
										};
										runPythonScript();
									}

									e.currentTarget.value = '';
								}
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ChatComponent;
