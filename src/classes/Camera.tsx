import { useState } from "react";

export enum CameraMode{
    FREE = "FREE",
    SIDE_VIEW = "SIDE_VIEW",
    UPPER_VIEW = "UPPER_VIEW"
}

export interface CameraProps{
    current: CameraMode,
    setCurrent: React.Dispatch<React.SetStateAction<CameraMode>>
}

export const useCamera = (): CameraProps => {
    const [current, setCurrent] = useState<CameraMode>(CameraMode.FREE);

    return {
        current,
        setCurrent,
    };
};

export default useCamera