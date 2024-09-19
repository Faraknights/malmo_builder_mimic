import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export default {
	basePath: isProd ? '/malmo_builder_mimic' : '',
	assetPrefix: isProd ? '/malmo_builder_mimic/' : '',

	output: 'export',
	sassOptions: {
		includePaths: [path.join(process.cwd(), 'src/styles')],
		additionalData: `$base-path: '${isProd ? '/malmo_builder_mimic' : ''}';`,
	},

	webpack(config, { dev, isServer }) {
		if (dev && !isServer) {
			config.output.publicPath = 'http://0.0.0.0:9000/_next/';

			if (config.devServer) {
				config.devServer.port = 9000;
				config.devServer.headers = {
					'Access-Control-Allow-Origin': '*',
				};
				config.devServer.hotOnly = true;
			}
		}

		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
};
