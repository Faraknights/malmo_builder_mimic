import React from 'react';
import Environment from './environment';
import ChatComponent from '../side/general/Chat';
import Side from '../side/Side';
import FileManager from '../side/visualization/FileManager';
import PointerIndicator from '../side/visualization/PointerIndicator';

const Visualization: React.FC = () => {
	return (
		<main>
			<div id="mainView">
				<PointerIndicator />
				<Environment />
			</div>
			<Side>
				<FileManager />
				<ChatComponent availableUsers={[]} />
			</Side>
		</main>
	);
};

export default Visualization;
