import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const webpackConfig = {
	resolve: {
		fallback: {
			fs: false,
			path: require.resolve('path-browserify'),
			os: require.resolve('os-browserify/browser'),
			util: require.resolve('util/'),
			stream: require.resolve('stream-browserify'),
			buffer: require.resolve('buffer/'),
			assert: require.resolve('assert/'),
		},
	},
	plugins: [new NodePolyfillPlugin()],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				resolve: {
					// Remove fullySpecified option
				},
			},
		],
	},
};

export default webpackConfig;
