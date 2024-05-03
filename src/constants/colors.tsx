import Color from "../interfaces/Color";

export enum definedColors {
	RED = "RED",
	BLUE = "BLUE",
	GREEN = "GREEN",
	ORANGE = "ORANGE",
	PURPLE = "PURPLE",
	YELLOW = "YELLOW"
}

export const COLORS: { [key in definedColors]: Color } = {
	[definedColors.RED]: {
		hex: "#ff4444",
		id: definedColors.RED
	},
	[definedColors.BLUE]: {
		hex: "#00a4ff",
		id: definedColors.BLUE
	},
	[definedColors.GREEN]: {
		hex: "#68c341",
		id: definedColors.GREEN
	},
	[definedColors.ORANGE]: {
		hex: "#ff8954",
		id: definedColors.ORANGE
	},
	[definedColors.PURPLE]: {
		hex: "#d354ff",
		id: definedColors.PURPLE
	},
	[definedColors.YELLOW]: {
		hex: "#ffdd00",
		id: definedColors.YELLOW
	}
};