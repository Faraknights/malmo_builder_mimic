import path from 'path';

export default {
	sassOptions: {
		includePaths: [path.join(process.cwd(), 'src/styles')],
	},
};
