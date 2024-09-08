import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const webpackConfig = {
  // Other configuration options

  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
    },
  },

  plugins: [new NodePolyfillPlugin()],
};

export default webpackConfig;
