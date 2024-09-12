import path from 'path';

export default {
	sassOptions: {
		includePaths: [path.join(process.cwd(), 'src/styles')],
	},
	basePath: '/malmo_builder_mimic',
	output: 'export',
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
};
