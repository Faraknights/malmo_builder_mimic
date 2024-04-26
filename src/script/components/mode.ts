export enum Mode{
	SIMULATION,
	VISUALIZATION
}

export class ModeMaster{
	currentMode: Mode;

	constructor(initialMode:Mode = Mode.SIMULATION){
		this.currentMode = initialMode
	}

	changeMode(newMode: Mode){
		this.currentMode = newMode
		document.querySelector("#modeSelector")?.setAttribute("mode", Mode[newMode])
	}
}