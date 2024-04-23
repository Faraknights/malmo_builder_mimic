export enum Mode {
    VISUALIZATION,
    SIMULATION
}

export class ModeMaster{
    private currentMode: Mode;

    constructor(initialMode: Mode = Mode.SIMULATION){
        this.currentMode = initialMode
        this.addAttributeToWrapper()
    }

    private addAttributeToWrapper(){
        document.querySelector('#wrapper')?.setAttribute("mode", Mode[this.currentMode])
    }

    getMode(): Mode{
        return this.currentMode
    }
    changeMode(newMode: Mode): void{
        this.currentMode = newMode
        this.addAttributeToWrapper()
    }
}