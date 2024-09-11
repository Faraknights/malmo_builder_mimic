import { Colors } from '../enum/Colors';
import Color from '../interfaces/Color';

export const COLORS: { [key in Colors]: Color } = {
	[Colors.RED]: {
		hex: '#ff0000',
		id: Colors.RED,
	},
	[Colors.BLUE]: {
		hex: '#1b4ccd',
		id: Colors.BLUE,
	},
	[Colors.GREEN]: {
		hex: '#008000',
		id: Colors.GREEN,
	},
	[Colors.ORANGE]: {
		hex: '#ff6600',
		id: Colors.ORANGE,
	},
	[Colors.PURPLE]: {
		hex: '#ac00e6',
		id: Colors.PURPLE,
	},
	[Colors.YELLOW]: {
		hex: '#ffa500',
		id: Colors.YELLOW,
	},
	[Colors.WHITE]: {
		hex: '#ffffff',
		id: Colors.WHITE,
	},
	[Colors.BLACK]: {
		hex: '#000000',
		id: Colors.BLACK,
	},
	[Colors.NEW]: {
		hex: '#deefe1',
		id: Colors.NEW,
	},
};
