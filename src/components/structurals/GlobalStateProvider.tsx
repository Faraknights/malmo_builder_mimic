// GlobalStateContext.js
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { EnvironmentMode } from '../../enum/EnvironmentMode';
import { GameMode } from '../../enum/GameMode';
import { ShapeInPlaceProps, useShapeInPlace } from '../../classes/shapeInPlace';
import { inventoryProps, useInventory } from '../../classes/Inventory';
import {
	defaultCameraByEnvironment,
	ENVIRONMENT_COLORS,
	ENVIRONMENT_SHAPES,
} from '../../constants/ENVIRONMENT_CONSTANTS';
import { Action } from '../../enum/Action';
import { chatProps, useChat } from '../../classes/Chat';
import { GameLog, worldStateProps } from '../../classes/gameLog';
import { Pointer } from '../../interfaces/Pointer';
import { CameraMode } from '../../enum/CameraMode';

export interface GlobalState {
	environmentMode: {
		environmentMode: EnvironmentMode;
		setEnvironmentMode: React.Dispatch<React.SetStateAction<EnvironmentMode>>;
	};
	gameMode: {
		gameMode: GameMode;
		setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
	};
	action: {
		action: Action;
		setAction: React.Dispatch<React.SetStateAction<Action>>;
	};
	pointer: {
		pointer: Pointer | undefined;
		setPointer: React.Dispatch<React.SetStateAction<Pointer | undefined>>;
	};
	gameLog: {
		gameLog: GameLog;
		setGameLog: React.Dispatch<React.SetStateAction<GameLog>>;
	};
	camera: {
		camera: CameraMode;
		setCamera: React.Dispatch<React.SetStateAction<CameraMode>>;
	};
	shapeInPlace: ShapeInPlaceProps;
	inventory: inventoryProps;
	chat: chatProps;
}

interface GlobalStateProviderProps {
	children: ReactNode;
	initialEnvironmentMode: EnvironmentMode;
	initialGameMode: GameMode;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
	children,
	initialEnvironmentMode,
	initialGameMode,
}) => {
	const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>(initialEnvironmentMode);
	const [gameMode, setGameMode] = useState<GameMode>(initialGameMode);
	const [action, setAction] = useState<Action>(Action.PLACE);
	const [gameLog, setGameLog] = useState<GameLog>(new GameLog());
	const [camera, setCamera] = useState<CameraMode>(defaultCameraByEnvironment[initialEnvironmentMode]);
	const shapeInPlace = useShapeInPlace();
	const chat = useChat();
	const inventory = useInventory(
		ENVIRONMENT_COLORS[initialEnvironmentMode],
		ENVIRONMENT_SHAPES[initialEnvironmentMode]
	);
	const [pointer, setPointer] = useState<Pointer | undefined>(undefined);

	const clearAll = () => {
		setAction(Action.PLACE);
		setGameLog(new GameLog());
		shapeInPlace.clear();
		chat.setChatHistory([]);
		inventory.setColors(ENVIRONMENT_COLORS[environmentMode]);
		inventory.setCurrentColor(ENVIRONMENT_COLORS[environmentMode][0]);
		inventory.setShapes(ENVIRONMENT_SHAPES[environmentMode]);
		inventory.setCurrentShape(ENVIRONMENT_SHAPES[environmentMode][0]);
		setCamera(defaultCameraByEnvironment[environmentMode]);
		setPointer(undefined);
	};

	useEffect(clearAll, [environmentMode, gameMode]);

	useEffect(() => {
		const lastWolrdState = gameLog.getLastWorldState();
		if (lastWolrdState) {
			if (
				shapeInPlace.objects.length !== lastWolrdState.shapeInPlace.length ||
				chat.chatHistory.length !== lastWolrdState.chatHistory.length
			) {
				gameLog.addWorldState({
					timestamp: new Date(),
					chatHistory: [...chat.chatHistory],
					shapeInPlace: [...shapeInPlace.objects],
				} as worldStateProps);
				setGameLog(gameLog);
			}
		} else {
			if (shapeInPlace.objects.length !== 0 || chat.chatHistory.length !== 0) {
				gameLog.addWorldState({
					timestamp: new Date(),
					chatHistory: [...chat.chatHistory],
					shapeInPlace: [...shapeInPlace.objects],
				} as worldStateProps);
				setGameLog(gameLog);
			}
		}
	}, [shapeInPlace.objects, chat.chatHistory]);

	const value: GlobalState = {
		environmentMode: { environmentMode, setEnvironmentMode },
		gameMode: { gameMode, setGameMode },
		action: { action, setAction },
		pointer: { pointer, setPointer },
		gameLog: { gameLog, setGameLog },
		camera: { camera, setCamera },
		shapeInPlace,
		inventory,
		chat,
	};

	return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalState = (): GlobalState => {
	const context = useContext(GlobalStateContext);
	if (context === undefined) {
		throw new Error('useGlobalState must be used within a GlobalStateProvider');
	}
	return context;
};
