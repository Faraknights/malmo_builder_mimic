import React from 'react';
import { useEffect } from 'react';
import Environment from './environment';
import Side from '../side/Side';
import ActionSelector from '../side/simulation/ActionSelector';
import { useGlobalState } from '../GlobalStateProvider';
import MultimodalSetup from '../side/multimodal/ActionSelector';

const Multimodal: React.FC = () => {
	const { shapeInPlace } = useGlobalState();

	useEffect(() => {
		if (shapeInPlace.pending) {
			document.body.style.cursor = 'pointer';
		} else {
			document.body.style.cursor = 'auto';
		}
	}, [shapeInPlace]);

	return (
		<main>
			<div id="mainView">
				<Environment />
			</div>
			<Side>
				<ActionSelector />
				<MultimodalSetup />
			</Side>
		</main>
	);
};

export default Multimodal;
