import { useState } from "react";

export enum Action{
    PLACE = "PLACE",
    BREAK = "BREAK"
}

export interface ActionProps{
    current: Action,
    setCurrent: React.Dispatch<React.SetStateAction<Action>>
}

export const useAction = (): ActionProps => {
    const [current, setCurrent] = useState<Action>(Action.PLACE);

    return {
        current,
        setCurrent,
    };
};

export default useAction