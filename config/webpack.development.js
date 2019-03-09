const path = require('path')
const webpack = require('webpack') //eslint-disable-line
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin') //eslint-disable-line

const port = 3003
module.exports = () => {
  return {
    devtool: 'cheap-module-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'public/'),
      port,
      hot: true,
      historyApiFallback: {
        disableDotRule: true,
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ErrorOverlayPlugin(),
    ],
  }
}
