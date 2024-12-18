import { CameraMode } from '../enum/CameraMode';

export interface CanvasCameraSettingsProps {
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

export const getDefaultCameraSettings = (position: [number, number, number]): CanvasCameraSettingsProps => {
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
			position: position,
		},
	};
};

export const CanvasCameraSettings: {
	[key in CameraMode]: CanvasCameraSettingsProps | (() => CanvasCameraSettingsProps);
} = {
	[CameraMode.FREE]: getDefaultCameraSettings([0, 5, 10]),
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
	[CameraMode.RANDOM]: () =>
		getDefaultCameraSettings([Math.random() * 30 - 15, Math.random() * 15 + 2, Math.random() * 30 - 15]),
	[CameraMode.RANDOM2]: () =>
		getDefaultCameraSettings([Math.random() * 30 - 15, Math.random() * 15 + 2, Math.random() * 30 - 15]),
};
