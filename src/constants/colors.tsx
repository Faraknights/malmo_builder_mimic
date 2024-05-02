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
		hex: "#ff0000",
		id: definedColors.RED
	},
	[definedColors.BLUE]: {
		hex: "#0000ff",
		id: definedColors.BLUE
	},
	[definedColors.GREEN]: {
		hex: "#00ff00",
		id: definedColors.GREEN
	},
	[definedColors.ORANGE]: {
		hex: "#ffa500",
		id: definedColors.ORANGE
	},
	[definedColors.PURPLE]: {
		hex: "#800080",
		id: definedColors.PURPLE
	},
	[definedColors.YELLOW]: {
		hex: "#ffff00",
		id: definedColors.YELLOW
	}
};