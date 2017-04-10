const Path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const AssetPlugin = require('assets-webpack-plugin')

const assetsPath = Path.resolve(__dirname, '../static/dist')
const projectRootPath = Path.resolve(__dirname, '../')

let babelrcObject = {}

const extractText = new ExtractTextPlugin({
  filename: '[name]-[chunkhash].css',
  disable: false,
  allChunks: true,
})
const assetPlugin = new AssetPlugin()

try {
  babelrcObject = require('../package.json').babel
} catch (err) {
  console.error('==>     ERROR: Error parsing your babel.json.')
  console.error(err)
}

let babelConfig = {}
if (babelrcObject.env) {
  babelConfig = babelrcObject.env.development
}

module.exports = {
  devtool: 'inline-source-map',
  context: Path.resolve(__dirname, '..'),
  entry: {
    main: [
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/static/dist/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
          'eslint-loader',
        ],
      },
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.css$/,
        use: extractText.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
        }),
        include: [
          Path.resolve(__dirname, '..', 'node_modules'),
          Path.resolve(__dirname, '..', 'src'),
        ],
      },
      {
        test: /assets\/css\/.*scss/,
        use: extractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
        include: [
          Path.resolve(__dirname, '..', 'node_modules'),
          Path.resolve(__dirname, '..', 'src'),
        ],
      },
      {
        test: /\.scss$/,
        exclude: /assets\/css\/.*scss/,
        use: extractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                // modules: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
              },
            },
          ],
        }),
        include: [
          Path.resolve(__dirname, '..', 'node_modules'),
          Path.resolve(__dirname, '..', 'src'),
        ],
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: /\.(png|jpg|jpeg)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.json', '.js', '.html'],
  },
  plugins: [
    assetPlugin,
    new CleanPlugin([assetsPath], { root: projectRootPath }),
    extractText,
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    // }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
    }),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: false,
    }),
  ],
}
