import Path from 'path'
import webpack from 'webpack'
import logger from '../src/server/logger'

const assetsPath = Path.resolve(__dirname, '../static/dist')
const host = 'localhost'
const port = process.env.PORT || 3001


const componentHotLoader = require.resolve('./loaders/component-loader')
const serviceHotLoader = require.resolve('./loaders/service-loader')
const templateHotLoader = require.resolve('./loaders/template-loader')

let babelrcObject = {}

try {
  babelrcObject = require('../package.json').babel
} catch (err) {
  logger.error('==>     ERROR: Error parsing your babel.json.')
  logger.error(err)
}

let babelConfig = {}
if (babelrcObject.env) {
  babelConfig = babelrcObject.env.development
}

export default {
  devtool: 'inline-source-map',
  context: Path.resolve(__dirname, '..'),
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: 'bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${host}:${port}/dist/`,
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
      { enforce: 'pre', test: /\.component\.js$/, loader: componentHotLoader, exclude: [/client\/lib/, /node_modules/, /\.spec\.js/] },
      { enforce: 'pre', test: /\.service\.js$/, loader: serviceHotLoader, exclude: [/client\/lib/, /node_modules/, /\.spec\.js/] },
      { enforce: 'post', test: /\.html/, loader: templateHotLoader },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
        ],
        include: [
          Path.resolve(__dirname, '..', 'node_modules'),
          Path.resolve(__dirname, '..', 'src'),
        ],
      },
      {
        test: /assets\/css\/.*scss/,
        use: [
          { loader: 'style-loader' },
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
        include: [
          Path.resolve(__dirname, '..', 'node_modules'),
          Path.resolve(__dirname, '..', 'src'),
        ],
      },
      {
        test: /\.scss$/,
        exclude: /assets\/css\/.*scss/,
        use: [
          { loader: 'style-loader' },
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
        include: [
          Path.resolve(__dirname, '..', 'node_modules'),
          Path.resolve(__dirname, '..', 'src'),
        ],
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: 'file-loader',
      }],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.json', '.js', '.html'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
    }),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: true,
    }),
  ],
}
