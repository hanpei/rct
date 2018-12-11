const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

const appDirectory = fs.realpathSync(process.cwd())
module.exports = {
  context: __dirname,
  entry: ['../src/index.js'],
  output: {
    path: resolve(__dirname, 'build'), //打包后的文件存放的地方
    filename: 'bundle.js' //打包后输出文件的文件名
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader' //在webpack-dev中不能使用--hot
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: '../index.html',
      title: 'Development'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devtool: 'cheap-eval-source-map'
}
