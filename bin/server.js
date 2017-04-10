#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: "off" */

require('../tools/babel-require')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

global.CLIENT = false
global.SERVER = true
global.DISABLE_SSR = false
global.DEVELOPMENT = process.env.NODE_ENV !== 'production'

if (DEVELOPMENT) {
  if (!require('piping')({
    hook: true,
    watch: path.resolve(`${__dirname}/../src`),
    ignore: /(\/\.|~$|\.json|\.scss$)/i,
  })) {
    return
  }
}

if (DEVELOPMENT) {
  global.assets = {
    main: {
      js: 'http://localhost:3001/dist/bundle.js',
    },
  }
} else {
  global.assets = require('../webpack-assets.json')
}

require('../src/server')
