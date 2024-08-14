const path = require('path');

module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, 'src/styles')],
	},
	basePath: '/malmo_builder_mimic',
	output: 'export',
};
