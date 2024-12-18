import React, { useState } from 'react';
import { ShapeList } from '../../../../enum/ShapeList';
import { useGlobalState } from '../../GlobalStateProvider';
import { ENVIRONMENT_COLORS, ENVIRONMENT_SHAPES } from '../../../../constants/ENVIRONMENT_CONSTANTS';
import { CameraMode } from '../../../../enum/CameraMode';
import JSZip from 'jszip'; // Import JSZip

const MultimodalSetup: React.FC = () => {
	const {
		environmentMode: { environmentMode },
		shapeInPlace,
		camera,
	} = useGlobalState();

	const [cameraPositions, setCameraPositions] = useState<number>(2); // Default to 1 camera position
	const [imageTitle, setImageTitle] = useState<string>('a tower of 3 [color] [shape]'); // Default title

	// Function to handle camera positions change
	const handleCameraPositionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCameraPositions(parseInt(event.target.value, 10));
	};

	// Function to handle title input change
	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setImageTitle(event.target.value);
	};

	interface Combination {
		shape: ShapeList;
		color: any;
		iteration: number;
	}

	const handleButtonClick = async () => {
		const allCombinations: Combination[] = [];
		// Collect all combinations of shapes and colors
		for (let i = 0; i < cameraPositions; i++) {
			ENVIRONMENT_SHAPES[environmentMode].forEach((shape) => {
				ENVIRONMENT_COLORS[environmentMode].forEach((color) => {
					allCombinations.push({ shape, color, iteration: i });
				});
			});
		}
		console.log(allCombinations);
		const imagesToDownload: { image: string; filename: string; title: string }[] = [];

		// Loop through each combination and handle state changes and screenshot
		for (let i = 0; i < allCombinations.length; i++) {
			const { shape, color, iteration } = allCombinations[i];

			// Generate the title based on the shape and color
			const title = `${imageTitle
				.replace('[color]', color.id.toLowerCase())
				.replace('[shape]', ShapeList[shape].toLowerCase())} (${iteration}).png`;

			// Update shape and color in place
			shapeInPlace.setObjects((prevObjects) => {
				return prevObjects.map((prevShape) => ({
					...prevShape,
					shape: shape,
					color: color,
				}));
			});

			// Update camera mode
			camera.setCamera((prevCamera) => {
				const newCameraMode = prevCamera === CameraMode.RANDOM ? CameraMode.RANDOM2 : CameraMode.RANDOM;
				return newCameraMode;
			});

			// Wait for the camera mode to update before proceeding
			await new Promise((resolve) => setTimeout(resolve, 400)); // Allow some time for the camera to update

			// Take the screenshot after the changes
			const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-engine="three.js r164"]');
			if (canvas) {
				const image = canvas.toDataURL('image/png');
				// Add image to the gallery
				const imgElement = document.createElement('img');
				imgElement.src = image;
				document.querySelector('.galery')?.appendChild(imgElement);
				// Store the image, filename, and title for download later
				const filename = title;
				imagesToDownload.push({ image, filename, title });
				console.log(`Image added for ${shape} with color ${color}: ${filename}`);
			} else {
				console.error('Canvas element not found');
			}

			// Add delay for each combination before continuing to the next one
			await new Promise((resolve) => setTimeout(resolve, 450)); // Delay for the next iteration
		}

		// After all images have been added, download the zip
		if (imagesToDownload.length > 0) {
			const zip = new JSZip();
			imagesToDownload.forEach(({ image, filename }) => {
				const imageBlob = dataURLToBlob(image); // Convert data URL to Blob
				zip.file(filename, imageBlob);
			});
			// Create the zip file and trigger download
			zip.generateAsync({ type: 'blob' }).then((content) => {
				const a = document.createElement('a');
				a.href = URL.createObjectURL(content);
				a.download = 'images.zip';
				a.click();
			});
		} else {
			console.error('No images to download');
		}
	};

	// Helper function to convert a data URL to a Blob
	const dataURLToBlob = (dataUrl: string): Blob => {
		const [header, base64] = dataUrl.split(',');
		const mimeMatch = header.match(/:(.*?);/);
		const mime = mimeMatch ? mimeMatch[1] : '';
		const binary = atob(base64);
		const length = binary.length;
		const buffer = new ArrayBuffer(length);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < length; i++) {
			view[i] = binary.charCodeAt(i);
		}
		return new Blob([view], { type: mime });
	};

	return (
		<div id="multimodalSetup" className="module">
			<h3>Multimodal Setup:</h3>
			<div>
				<label htmlFor="cameraPositions">Number of Camera Positions:</label>
				<input
					type="number"
					id="cameraPositions"
					value={cameraPositions}
					onChange={handleCameraPositionsChange}
					min="1"
					max="10"
				/>
			</div>
			<div>
				<label htmlFor="imageTitle">Image Title:</label>
				<input type="text" id="imageTitle" value={imageTitle} onChange={handleTitleChange} />
			</div>
			<button onClick={handleButtonClick}>BOOM</button>
			<div className="galery" style={{ display: 'flex', flexWrap: 'wrap' }}></div>
		</div>
	);
};

export default MultimodalSetup;
