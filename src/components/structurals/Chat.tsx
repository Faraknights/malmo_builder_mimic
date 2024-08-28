import React, { useEffect, useRef, useState } from 'react';
import { chatProps } from '../../classes/Chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import isBase64 from '../../tools/isBase64';
import { ServerMessage } from '../../interfaces/serverMessage';
import { parseInstruction } from '../../tools/csvReader';
import { GameLog } from '../../classes/gameLog';
import { ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { EnvironmentMode } from '../../classes/EnvironmentMode';
interface chatComponentProps {
	chat: chatProps;
	availableUsers: Users[];
	shapeInPlace: ShapeInPlaceProps;
	nebula?: boolean;
	environmentMode: EnvironmentMode;
}

export enum Users {
	SYSTEM = 'SYSTEM',
	ARCHITECT = 'ARCHITECT',
	BUILDER = 'BUILDER ',
	NEBULA = 'NEBULA',
}

const ChatComponent: React.FC<chatComponentProps> = ({
	chat,
	availableUsers,
	nebula,
	shapeInPlace,
	environmentMode,
}) => {
	const chatRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [chat.chatHistory]);

	const [user, setUser] = useState<Users>(Users.ARCHITECT);
	const [disable, setDisable] = useState<boolean>(false);

	return (
		<div id="chat" className="module">
			<h3>Chat</h3>
			<hr />
			<div ref={chatRef}>
				{chat.chatHistory.map((message, i) => (
					<div key={i}>
						{(i === 0 || message.user !== chat.chatHistory[i - 1].user) && (
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

			{availableUsers.length >= 1 && (
				<>
					<hr />
					<div>
						<button
							onClick={() => {
								setUser(
									availableUsers[
										(availableUsers.findIndex((x) => x === user) + 1) % availableUsers.length
									] as Users
								);
							}}
						>
							{user}
						</button>
						<input
							type="text"
							className={disable ? 'disable' : ''}
							disabled={disable}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									const message = e.currentTarget.value;
									chat.addMessage({
										content: message,
										user: user,
									});

									if (nebula) {
										const runPythonScript = async () => {
											const link =
												environmentMode === EnvironmentMode.MINECRAFT
													? '/api/nebula_minecraft'
													: '/api/nebula_cocobots';
											await fetchEventSource(link, {
												method: 'POST',
												headers: {
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													message,
												}),
												onmessage: async (ev) => {
													if (ev.data) {
														let full_message = '';
														if (isBase64(ev.data)) {
															full_message = atob(ev.data);
														} else {
															full_message = ev.data;
														}
														try {
															const message = JSON.parse(full_message) as ServerMessage;
															console.log(message);
															if (message.type === 'WAIT') {
																chat.addMessage({
																	content: message.content,
																	user: Users.SYSTEM,
																});
																setDisable(true);
															} else if (message.type === 'MESSAGE') {
																console.log(
																	/^(place .*|pick) -?[0-9]+ -?[0-9]+ -?[0-9]+\n?$/gm.test(
																		message.content
																	)
																);
																if (
																	/^(place .*|pick) -?[0-9]+ -?[0-9]+ -?[0-9]+\n?$/gm.test(
																		message.content
																	)
																) {
																	const instructions = message.content
																		.trim()
																		.split('\n');
																	const gameLog = new GameLog();
																	gameLog.gameLog[0].shapeInPlace =
																		shapeInPlace.objects;

																	instructions.forEach((instruction) => {
																		parseInstruction(
																			instruction.trim(),
																			gameLog,
																			environmentMode
																		);
																	});

																	console.log(gameLog);

																	function delay(ms: number) {
																		return new Promise((resolve) =>
																			setTimeout(resolve, ms)
																		);
																	}

																	async function processLogs(gameLog: GameLog) {
																		for (
																			let i = 1;
																			i < gameLog.gameLog.length;
																			i++
																		) {
																			const log = gameLog.gameLog[i];

																			shapeInPlace.setObjects(log.shapeInPlace);
																			await delay(500); // 500ms delay
																		}
																	}

																	processLogs(gameLog);
																} else {
																	chat.addMessage({
																		content: message.content,
																		user: Users.NEBULA,
																	});
																}
																setDisable(false);
															}
														} catch (error) {
															console.error('Failed to parse JSON:', error);
														}
													}
												},
											});
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
