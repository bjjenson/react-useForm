const CompressionWebpackPlugin = require('compression-webpack-plugin') //eslint-disable-line
const CleanWebpackPlugin = require('clean-webpack-plugin') //eslint-disable-line

module.exports = () => ({
  plugins: [
    new CompressionWebpackPlugin(),
    new CleanWebpackPlugin(['../build'], { verbose: true, allowExternal: true }),
  ],
})
