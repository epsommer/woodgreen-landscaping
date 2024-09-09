import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const webpackConfig = {
  resolve: {
    fallback: {
      fs: false, // Disable 'fs' in browsers
      path: require.resolve('path-browserify'), // Polyfill 'path'
      os: require.resolve('os-browserify/browser'), // Polyfill 'os'
      util: require.resolve('util/'), // Polyfill 'util'
      stream: require.resolve('stream-browserify'), // Polyfill 'stream'
      buffer: require.resolve('buffer/'), // Polyfill 'buffer'
      assert: require.resolve('assert/'), // Polyfill 'assert'
    },
  },
  plugins: [new NodePolyfillPlugin()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // Allow for bare imports
        },
      },
    ],
  },
};

export default webpackConfig;
