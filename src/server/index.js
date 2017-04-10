/* eslint global-require: "off" */

// import PrettyError from 'pretty-error'
import Boom from 'boom'
import fs from 'fs'
import path from 'path'

import logger from './logger'
import { server as hapiServer } from './core'

// 인증 핸들러
const internals = {
  auth(server, options, role) {
    return {
      authenticate(request, reply) {
        const user = request.yar.get('user')
        if (!user || !user.roles || user.roles.indexOf(role) === -1) {
          reply(Boom.unauthorized('invalid role', 'oauth2'), null, {})
          return
        }
        request.user = user
        reply.continue({
          credentials: {},
        })
      },
    }
  },
  authMember(server, options) {
    return internals.auth(server, options, 'member')
  },
  authAdmin(server, options) {
    return internals.auth(server, options, 'admin')
  },
  authSuper(server, options) {
    return internals.auth(server, options, 'super')
  },
}

// 서버 시작
const start = async () => {
  await hapiServer.init({
    auths: [
      ['memberRequired', internals.authMember],
      ['adminRequired', internals.authAdmin],
      ['superRequired', internals.authSuper],
    ],
  })
  // const pretty = new PrettyError()

  hapiServer.route({
    method: '*',
    path: '/{p*}',
    handler: (request, reply) => {
      if (request.path !== '/') {
        const fPath = path.resolve(`${__dirname}/../../static/${request.path}`)
        try {
          if (fs.statSync(fPath)) {
            return reply.file(fPath)
          }
        } catch (e) {
          /* empty */
        }
      }
      const scriptTags = Object.keys(assets).filter(key => typeof assets[key].js !== 'undefined').map(key => `<script src="${assets[key].js}"></script>`)
      const linkTags = Object.keys(assets).filter(key => typeof assets[key].css !== 'undefined').map(key => `<link href="${assets[key].css}" rel="stylesheet">`)
      return reply(`
        <!DOCTYPE html>
        <html lang="en" ng-app="woo1.kr">
          <head>
            <link rel="shortcut icon" href="/favicon.ico?v=3" />
            <base href="/">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,300,400,600,700,800" rel="stylesheet">
            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
            ${linkTags.join('')}
          </head>
          <body class="app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden">
            <div id="main" ui-view></div>
            ${scriptTags.join('')}
          </body>
        </html>
      `.replace(/\s{2,}/g, ' ').replace(/> </g, '><').trim())
    },
  })

  hapiServer.start((err) => {
    if (err) throw err
    logger.info(`✅  server has started at ${hapiServer.info.uri}`)
  })
}

start().catch((e) => {
  logger.error(e, e.stack)
})
