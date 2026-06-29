const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');
const deps = pkg.dependencies;

// dev → localhost:3001; prod → Netlify env var set to the remote's deployed URL.
const REMOTE_URL = process.env.REMOTE_URL || 'http://localhost:3001';

module.exports = {
  entry: './src/index.ts',
  output: {
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
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
      name: 'host',
      // remote@URL is resolved at runtime — the remote's code is never bundled into host.
      remotes: {
        remote: `remote@${REMOTE_URL}/remoteEntry.js`,
      },
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
