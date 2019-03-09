const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const getVars = require('./env')
const presetConfig = require('./loadPresets')

const modeConfig = env => require(`./webpack.${env}`)(env) // eslint-disable-line

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  console.log('building', mode, presets)
  return webpackMerge(
    {
      mode,
      entry: [
        'babel-polyfill',
        './src/examples/index.js',
      ],
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.scss$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'sass-loader' },
            ],
          },
          {
            test: /\.css$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
            ],
          },
          {
            test: /\.(ico)$/,
            loader: 'file-loader',
          },
          {
            test: /\.(png|gif|jpg|svg)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 50000,
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.scss', '.js', '.json', '.png', '.gif', '.jpg', '.svg'],
      },
      plugins: [
        mode === 'development' ? new Dotenv() : () => { },
        new webpack.EnvironmentPlugin({
          ...getVars(),
          NODE_ENV: process.env.NODE_ENV || mode,
        }),
        new HtmlWebpackPlugin({
          inject: true,
          template: './public/index.html',
          favicon: './public/favicon.ico',
          manifest: './public/manifest.json',
        }),
        new webpack.ProgressPlugin(),
      ],
      output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/',
        filename: '[name].[hash:8].js',
        chunkFilename: '[name].[hash:8].chunk.js',
      },
    },
    modeConfig(mode),
    presetConfig({ mode, presets }),
  )
}
