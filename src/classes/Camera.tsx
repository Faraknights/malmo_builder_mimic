import { useState } from "react";

export enum CameraMode {
  FREE = "Free camera",
  SIDE_VIEW = "Side view",
  UPPER_VIEW = "Upper view"
}

export interface CameraProps {
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

interface CanvasCameraSettingsProps {
  orthographic: boolean;
  polarAngle: {
    min: number;
    max: number;
  };
  cameraSettings: any;
  azimuthAngle?: {
    max: number;
    min: number;
  };
}

export const getDefaultCameraSettings = (): CanvasCameraSettingsProps => {
  const aspect = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1;
  return {
    orthographic: false,
    polarAngle: {
      max: Math.PI,
      min: 0,
    },
    cameraSettings: {
      fov: 75,
      aspect: aspect,
      near: 0.1,
      far: 1000,
      position: [0, 5, 10],
    },
  };
};

export const CanvasCameraSettings: { [key in CameraMode]: CanvasCameraSettingsProps } = {
  [CameraMode.FREE]: getDefaultCameraSettings(),
  [CameraMode.SIDE_VIEW]: {
    orthographic: true,
    polarAngle: {
      max: Math.PI / 2,
      min: Math.PI / 2,
    },
    cameraSettings: {
      zoom: 50,
      position: [100, 5, 10],
    },
  },
  [CameraMode.UPPER_VIEW]: {
    orthographic: true,
    polarAngle: {
      max: 0,
      min: 0,
    },
    cameraSettings: {
      zoom: 50,
      position: [0, 5, 10],
    },
    azimuthAngle: {
      max: 0,
      min: 0,
    },
  },
};

export default useCamera;
