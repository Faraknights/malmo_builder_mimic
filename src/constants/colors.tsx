import Color from '../interfaces/Color';

export enum definedColors {
	RED = 'RED',
	BLUE = 'BLUE',
	GREEN = 'GREEN',
	ORANGE = 'ORANGE',
	PURPLE = 'PURPLE',
	YELLOW = 'YELLOW',
	WHITE = 'WHITE',
	BLACK = 'BLACK',
	NEW = 'NEW',
}

export const COLORS: { [key in definedColors]: Color } = {
	[definedColors.RED]: {
		hex: '#ff0000',
		id: definedColors.RED,
	},
	[definedColors.BLUE]: {
		hex: '#1b4ccd',
		id: definedColors.BLUE,
	},
	[definedColors.GREEN]: {
		hex: '#008000',
		id: definedColors.GREEN,
	},
	[definedColors.ORANGE]: {
		hex: '#ff6600',
		id: definedColors.ORANGE,
	},
	[definedColors.PURPLE]: {
		hex: '#ac00e6',
		id: definedColors.PURPLE,
	},
	[definedColors.YELLOW]: {
		hex: '#ffa500',
		id: definedColors.YELLOW,
	},
	[definedColors.WHITE]: {
		hex: '#ffffff',
		id: definedColors.WHITE,
	},
	[definedColors.BLACK]: {
		hex: '#000000',
		id: definedColors.BLACK,
	},
	[definedColors.NEW]: {
		hex: '#deefe1',
		id: definedColors.NEW,
	},
};
