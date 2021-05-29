'use strict';

process.env.BABEL_ENV = 'web';

const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { entries, htmlPlugin } = require('./muti-page.config');

let webConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: entries(),
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
        },
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [path.resolve(__dirname, '../src/renderer')],
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: true,
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
            },
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name].[ext]',
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new webpack.DefinePlugin({
      'process.env.IS_WEB': 'true',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ].concat(htmlPlugin()),
  output: {
    filename: '[name]/index.js',
    path: path.join(__dirname, '../dist/web'),
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.vue', '.json', '.css'],
  },
  target: 'web',
};

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  webConfig.devtool = '';

  webConfig.plugins.push(
    new MinifyPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/web/static'),
        ignore: ['.*'],
      },
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  );
}

module.exports = webConfig;
