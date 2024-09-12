(self.__BUILD_MANIFEST = {
	__rewrites: { afterFiles: [], beforeFiles: [], fallback: [] },
	'/': ['static/chunks/pages/index-260f343a16d7839f.js'],
	'/_error': ['static/chunks/pages/_error-77823ddac6993d35.js'],
	'/[gameMode]/[environmentMode]': [
		'static/chunks/fb7d5399-dff9845229d97d9a.js',
		'static/chunks/4d99978a-c055aa64b5509ab7.js',
		'static/chunks/486-6d811a152eada7d0.js',
		'static/chunks/pages/[gameMode]/[environmentMode]-08e1bf1f01c809e5.js',
	],
	sortedPages: ['/', '/_app', '/_error', '/[gameMode]/[environmentMode]'],
}),
	self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB();
