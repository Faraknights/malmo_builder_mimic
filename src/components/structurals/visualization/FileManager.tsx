import React, { useEffect, useState } from 'react';
import { parseCSV } from '../../../tools/csvReader';
import { parseJSON } from '../../../tools/jsonReaded';
import { GameLog } from '../../../classes/gameLog';
import { JsonlEvent } from '../../../interfaces/jsonlDataStructure';
import { useGlobalState } from '../GlobalStateProvider';

// Memoized GameComponent to optimize rendering
const GameComponent: React.FC<{
	gameLog: GameLog;
	currentIndex: number;
	currentgameId: number;
	onClick: () => void;
	searched: boolean;
}> = React.memo(({ gameLog, currentIndex, currentgameId, onClick, searched }) => {
	return (
		<div
			className={`game ${currentIndex === currentgameId ? 'selected' : ''} ${searched ? 'searched' : ''}`}
			onClick={onClick}
		>
			{(!gameLog.getWorldStateById(0)?.chatHistory.length &&
				!gameLog.getWorldStateById(0)?.shapeInPlace.length && <div className="new"></div>) || (
				<div className="old"></div>
			)}
			<span>Game {currentIndex}</span>
		</div>
	);
});

GameComponent.displayName = 'GameComponent';

const FileManager: React.FC = () => {
	const {
		environmentMode: { environmentMode },
		chat,
		shapeInPlace,
	} = useGlobalState();

	const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
	const [currentgameId, setcurrentgameId] = useState<number>(0);
	const [step, setStep] = useState<number>(0);
	const [textFinder, setTextFinder] = useState<string>('');

	useEffect(() => {
		const lastChangeId = gameLogs[currentgameId]?.gameLog.reduce(
			(acc, cur, idx, arr) => (cur.chatHistory.length !== (arr[idx - 1]?.chatHistory.length ?? 0) ? idx : acc),
			0
		);
		if (lastChangeId) {
			setStep(lastChangeId);
		} else {
			setStep(0);
		}
	}, [currentgameId]);

	useEffect(() => {
		if (gameLogs[currentgameId]) {
			const worldState = gameLogs[currentgameId].getWorldStateById(step)!;
			if (worldState) {
				shapeInPlace.setObjects(worldState.shapeInPlace);
				chat.setChatHistory(worldState.chatHistory);
			}
		}
	}, [currentgameId, step]);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();

			try {
				console.log(fileExtension);
				if (fileExtension === 'csv') {
					const reader = new FileReader();
					reader.onload = (event) => {
						const csv = event.target?.result as string;
						const newGameLogs = parseCSV(csv, environmentMode);
						setGameLogs((prevGameLogs) => [...prevGameLogs, ...newGameLogs]);
					};
					reader.readAsText(file);
				} else if (fileExtension === 'json') {
					const newGameLogs = await parseJSON(file);
					setGameLogs((prevGameLogs) => [...prevGameLogs, ...newGameLogs]);
				} else if (fileExtension === 'jsonl') {
					const reader = new FileReader();
					reader.onload = (event) => {
						const jsonl = event.target?.result as string;
						const lines = jsonl
							.split('\n')
							.filter(
								(line) =>
									typeof line === 'string' &&
									// eslint-disable-next-line no-useless-escape
									/^[\[\{]/.test(line.trim()) &&
									(() => {
										JSON.parse(line);
										return true;
									})
							)
							.map((line) => JSON.parse(line) as JsonlEvent);
						console.log(lines);
					};
					reader.readAsText(file);
				} else {
					console.error('Unsupported file type:', fileExtension);
				}
				event.target.value = '';
			} catch (error) {
				console.error('Error processing file:', error);
			}
		}
	};

	console.log(gameLogs);
	return (
		<div id="fileManager" className="module">
			<label htmlFor="gameFileInput">Upload Game file</label>
			<input id="gameFileInput" type="file" onChange={handleFileChange} />
			<hr />
			<div id="games">
				{gameLogs.map((gameLog, i) => (
					<GameComponent
						key={i}
						gameLog={gameLog}
						currentIndex={i}
						currentgameId={currentgameId}
						onClick={() => {
							if (i !== currentgameId) {
								setcurrentgameId(i);
							}
						}}
						searched={
							textFinder !== '' &&
							gameLog.gameLog.some((log) =>
								log.chatHistory.some((text) => text.content && text.content.includes(textFinder))
							)
						}
					/>
				))}
			</div>
			{gameLogs.length >= 1 && (
				<input
					type="text"
					className="inputFinder"
					value={textFinder}
					onChange={(e) => {
						setTextFinder(e.target.value);
					}}
					placeholder="text to search"
				/>
			)}
			<hr />
			<div id="gameManager" className={!gameLogs[currentgameId] ? 'disabled' : ''}>
				<input
					type="range"
					min={0}
					step={1}
					max={gameLogs[currentgameId] ? gameLogs[currentgameId].getLength() - 1 : 1}
					value={step}
					onChange={(e) => {
						setStep(parseInt(e.target.value));
					}}
				/>
				<div className="buttonWrapper">
					<div
						className={`previousGame${!!gameLogs[currentgameId] && currentgameId === 0 ? ' disabled' : ''}`}
						onClick={() => {
							setcurrentgameId((prevId) => prevId - 1);
						}}
					></div>
					<div
						className={`previousStep${!!gameLogs[currentgameId] && step === 0 ? ' disabled' : ''}`}
						onClick={() => {
							setStep((prevStep) => prevStep - 1);
						}}
					></div>
					<div
						className={`nextStep${!!gameLogs[currentgameId] && step === gameLogs[currentgameId].getLength() - 1 ? ' disabled' : ''}`}
						onClick={() => {
							console.log(step);
							setStep((prevStep) => prevStep + 1);
							console.log(gameLogs);
						}}
					></div>
					<div
						className={`nextGame${!!gameLogs[currentgameId] && currentgameId === gameLogs.length - 1 ? ' disabled' : ''}`}
						onClick={() => {
							setcurrentgameId((prevId) => prevId + 1);
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

export default FileManager;
