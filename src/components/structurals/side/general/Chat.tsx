import React, { useEffect, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import isBase64 from '../../../../scripts/isBase64';
import { ServerMessage } from '../../../../interfaces/ServerMessage';
import { GameLog } from '../../../../classes/GameLog';
import { EnvironmentMode } from '../../../../enum/EnvironmentMode';
import { GameMode } from '../../../../enum/GameMode';
import { useGlobalState } from '../../GlobalStateProvider';
import { Users } from '../../../../enum/Chat';
import { USERS_ICON_URL } from '../../../../constants/ICONS';
import { SystemMessage } from '../../../../enum/SystemMessage';
import { parseInstruction } from '../../../../scripts/csvReader';

interface chatComponentProps {
	availableUsers: Users[];
}

const ChatComponent: React.FC<chatComponentProps> = ({ availableUsers }) => {
	const chatRef = useRef<HTMLDivElement>(null);
	const {
		chat,
		gameMode: { gameMode },
		environmentMode: { environmentMode },
		shapeInPlace,
	} = useGlobalState();

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [chat.chatHistory]);

	const [user, setUser] = useState<Users>(Users.ARCHITECT);
	const [disable, setDisable] = useState<boolean>(false);
	const [clicked, setClicked] = useState<boolean>(false);

	const pythonCall = () => {
		setClicked(true);
		const message = (
			chat.chatHistory.some(
				(message) => message.user === Users.SYSTEM && message.content === SystemMessage.PLACEMENT
			)
				? chat.chatHistory.slice(
						chat.chatHistory.reduceRight(
							(acc, message, index) =>
								acc === -1 &&
								message.user === Users.SYSTEM &&
								message.content === SystemMessage.PLACEMENT
									? index
									: acc,
							-1
						) + 1
					)
				: chat.chatHistory.filter((message) => message.user !== Users.SYSTEM)
		)
			.map((message) => message.content)
			.join('. ');
		console.log(message);
		if (gameMode === GameMode.NEBULA) {
			const runPythonScript = async () => {
				const link =
					environmentMode === EnvironmentMode.MINECRAFT ? '/api/nebula_minecraft' : '/api/nebula_cocobots';
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
									setClicked(false);
								} else if (message.type === 'MESSAGE') {
									console.log(
										/^(place .*|pick) -?[0-9]+ -?[0-9]+ -?[0-9]+\n?$/gm.test(message.content)
									);
									if (/^(place .*|pick) -?[0-9]+ -?[0-9]+ -?[0-9]+\n?$/gm.test(message.content)) {
										const instructions = message.content.trim().split('\n');
										const gameLog = new GameLog();
										gameLog.gameLog[0].shapeInPlace = shapeInPlace.objects;

										instructions.forEach((instruction) => {
											parseInstruction(instruction.trim(), gameLog, environmentMode);
										});

										console.log(gameLog);

										function delay(ms: number) {
											return new Promise((resolve) => setTimeout(resolve, ms));
										}

										async function processLogs(gameLog: GameLog) {
											for (let i = 1; i < gameLog.gameLog.length; i++) {
												const log = gameLog.gameLog[i];

												shapeInPlace.setObjects(log.shapeInPlace);
												await delay(200); // 500ms delay
											}

											chat.addMessage({
												user: Users.SYSTEM,
												content: SystemMessage.PLACEMENT,
											});
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
	};

	return (
		<div id="chat" className="module">
			<h3>Chat</h3>
			<hr />
			<div className="historyMessages" ref={chatRef}>
				{chat.chatHistory.map((message, i) => (
					<div key={i}>
						{(i === 0 || message.user !== chat.chatHistory[i - 1].user) && (
							<div>
								<img className="userIcon" src={USERS_ICON_URL[message.user]} alt="userIcon" />
								<span className="userName" key={`user-${i}`}>
									{message.user}
								</span>
							</div>
						)}
						<div key={i} className={`message${message.user === Users.SYSTEM ? ' system' : ''}`}>
							{message.content}
						</div>
					</div>
				))}
			</div>

			{availableUsers.length >= 1 && (
				<>
					<hr />
					<div className="buttons">
						<div className="mainButtons">
							<button
								className={availableUsers.length !== 1 ? 'realisticButton' : 'alone'}
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
								placeholder="writing here..."
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										const message = e.currentTarget.value;
										chat.addMessage({
											content: message,
											user: user,
										});

										e.currentTarget.value = '';
									}
								}}
							/>
						</div>
						{gameMode === GameMode.NEBULA && (
							<button
								className={
									'realisticButton generate' +
									(disable ||
									(chat.chatHistory.some(
										(message) =>
											message.user === Users.SYSTEM && message.content === SystemMessage.PLACEMENT
									)
										? chat.chatHistory.slice(
												chat.chatHistory.reduceRight(
													(acc, message, index) =>
														acc === -1 &&
														message.user === Users.SYSTEM &&
														message.content === SystemMessage.PLACEMENT
															? index
															: acc,
													-1
												) + 1
											)
										: chat.chatHistory.filter((message) => message.user !== Users.SYSTEM)
									).length === 0
										? ' disabled'
										: '')
								}
								onClick={pythonCall}
							>
								{clicked ? (
									<img src="/assets/images/loading_colorful.gif" alt="loading image" />
								) : (
									<>
										<span>Generate</span>
										<svg version="1.0" viewBox="0 0 200 200">
											<g
												transform="translate(0,200) scale(0.1,-0.1)"
												fill="#000000"
												stroke="none"
											>
												{/* prettier-ignore */}
												<path d="M1426 1808 c-9 -12 -16 -30 -16 -40 0 -9 -11 -48 -25 -85 -37 -103 -78 -134 -236 -177 -58 -16 -76 -37 -58 -68 5 -9 39 -23 76 -32 38 -10 90 -29 118 -44 59 -32 95 -90 121 -195 27 -110 80 -116 103 -10 18 82 57 159 94 187 27 21 88 44 197 75 28 8 39 44 20 66 -6 7 -27 16 -47 20 -60 11 -141 45 -174 72 -37 32 -63 81 -84 164 -9 35 -21 70 -27 77 -16 19 -45 14 -62 -10z"/>
												{/* prettier-ignore */}
												<path d="M791 1451 c-7 -5 -27 -60 -43 -122 -77 -293 -153 -370 -442 -449 -122 -33 -131 -37 -134 -61 -4 -34 10 -43 98 -64 115 -27 229 -71 287 -111 89 -61 152 -180 198 -374 21 -88 30 -102 64 -98 24 3 28 12 61 133 43 157 74 225 130 288 55 62 167 116 319 154 95 23 115 32 124 52 10 20 8 26 -12 42 -13 11 -31 19 -41 19 -34 0 -196 51 -267 84 -130 62 -194 154 -247 358 -40 148 -56 174 -95 149z"/>
											</g>
										</svg>
									</>
								)}
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ChatComponent;
