import React from 'react';
import Environment from './environment';
import ChatComponent from './Chat';
import Side from './Side';
import FileManager from './visualization/FileManager';
import PointerIndicator from './visualization/PointerIndicator';

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
