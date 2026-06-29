const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');
const deps = pkg.dependencies;

module.exports = {
  entry: './src/index.ts',
  output: {
    // 'auto' lets federated chunks load from the remote's own origin (matters cross-origin).
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  devServer: {
    port: 3001,
    // Allow the host (different origin) to fetch remoteEntry.js during local dev.
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/Widget',
      },
      // Share React as a singleton so host and remote never load two copies.
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
    // Bake version + build time into the bundle so the UI can show which deploy it is.
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
