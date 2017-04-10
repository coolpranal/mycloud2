// @flow

import Hapi from 'hapi'
import Fs from 'fs'
import Nes from 'nes'
import Inert from 'inert'
import Vision from 'vision'
import Path from 'path'

import logger from '../logger'
import settings from '../../../settings'
import { sequelize } from './db'

const handlers = []
const models = {}
const commands = {}
const command = {}

command.route = (mod: string, identifier: string, callback: () => {}) => {
  if (typeof commands[mod] === 'undefined') commands[mod] = {}
  commands[mod][identifier] = callback
}

command.execute = (mod: string, identifier: string) => {
  commands[mod][identifier]()
}

const apps = [...settings.apps, 'core']
const modules = {
  items: [],
  push: (item: string) => {
    modules.items.push(item)
  },
  install: () => {
    modules.items.forEach(it => require(it)) // eslint-disable-line import/no-dynamic-require
  },
}

apps.forEach((app) => {
  ['model', 'view', 'api', 'task', 'command'].forEach((mod) => {
    // TODO load command separately
    const file = `../${app}/${mod}`
    try {
      Fs.statSync(`${__dirname}/${file}.js`)
    } catch (e) {
      return
    }
    try {
      if (mod === 'model') {
        const importedModels = sequelize.import(file)
        Object.keys(importedModels).forEach((it) => {
          models[it] = importedModels[it]
        })
      } else {
        modules.push(Path.resolve(`${__dirname}/../${app}/${mod}`))
      }
    } catch (e) { logger.error(e) }
  })
})

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) models[modelName].associate(models)
})

// for catbox
const redis = settings.redis[process.env.NODE_ENV].url

// make server
const server = new Hapi.Server({
  cache: {
    engine: require('catbox-redis'),
    name: 'session',
    socket: {
      url: redis,
    },
  },
})

server.init = async (options: Object) => {
  let port

  if (process.env.PORT) {
    port = process.env.PORT
  } else if (process.env.NODE_ENV !== 'production') {
    port = 3000
  } else {
    port = 8080
  }

  server.connection({
    port,
    routes: {
      json: {
        space: 2,
      },
    },
  })

  // hapijs plugin
  try {
    await (new Promise((resolve, reject) => {
      server.register([
        Inert,
        Vision,
        {
          register: require('yar'),
          options: {
            maxCookieSize: 0,
            cache: {
              cache: 'session',
            },
            cookieOptions: {
              password: 'the-password-must-be-at-least-32-characters-long',
              isSecure: false,
            },
          },
        },
        {
          register: require('hapi-es7-async-handler'),
          options: {
            server,
          },
        },
        {
          register: require('hapi-swagger'),
          options: {
            info: {
              title: 'Test API Documentation',
              version: '0.1',
            },
            grouping: 'tags',
          },
        },
        Nes,
      ], (err) => {
        if (err) reject(err)
        resolve(true)
      })
    }))
  } catch (e) {
    logger.error(e, e.stack)
  }

  // auth
  // HOEK apply default
  try {
    options.auths.forEach((auth) => {
      server.auth.scheme(auth[0], auth[1])
      server.auth.strategy(auth[0], auth[0], {
        validateFunc: () => { },
      })
    })
  } catch (e) {
    logger.error(e, e.stack)
  }

  // call module installer
  try {
    modules.install()
    handlers.forEach(handler => server.route(handler))
  } catch (e) {
    logger.error('module install error', e)
  }
}

const makeRoutes = (prefix = '') => {
  const innerRoute = {}
  const methods = ['get', 'post', 'put', 'del', 'any']
  methods.forEach((hm) => {
    let method = hm.toUpperCase()
    if (hm === 'any') method = '*'
    if (hm === 'del') method = 'delete'
    innerRoute[hm] = (path, config, handler) => handlers.push({
      path: `${prefix}${path}`,
      method,
      handler,
      config,
    })
  })
  innerRoute.nested = (prefixNested: string) => makeRoutes(prefix + prefixNested)
  return innerRoute
}
const route = makeRoutes()

export {
  modules,
  sequelize,
  route,
  command,
  models,
  logger,
  server,
}
