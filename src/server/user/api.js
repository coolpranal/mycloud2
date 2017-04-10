import Joi from 'joi'
import Boom from 'boom'
import superagent from 'superagent'
import { route, models } from '../core'
import settings from '../../../settings'

const { User } = models
const nestedRoute = route.nested('/api/user')


nestedRoute.get('/load-auth', {
  description: 'load authentication state',
  tags: ['api', 'user'],
}, async (request, reply) => {
  const user = request.yar.get('user')
  if (user) reply(request.yar.get('user'))
  else reply(Boom.unauthorized('not logged in'))
})

nestedRoute.get('/login-uri', {
  description: 'gitlab login url creator',
  tags: ['api', 'user'],
}, async (request, reply) => {
  reply({ url: '' })
})

nestedRoute.get('/request-grant', {
  description: 'gitlab oauth grant receiver',
  tags: ['api', 'user'],
}, (request, reply) => {
  const code = request.query.code
  const requestTokenUrl = 'http://git.woo1.kr/oauth/token'
  const env = process.env.NODE_ENV
  const { GITLAB_CLIENT_ID, GITLAB_SECRET, GITLAB_REDIRECT_URL } = settings.gitlab[env]

  superagent.post(requestTokenUrl)
    .send({
      client_id: GITLAB_CLIENT_ID,
      client_secret: GITLAB_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GITLAB_REDIRECT_URL,
    })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .end((err, res) => {
      if (err) {
        return reply.redirect('/login')
      }
      superagent.get('http://git.woo1.kr/api/v3/user')
        .set('Authorization', `bearer ${res.body.access_token}`)
        .end((err2, res2) => {
          if (err2) {
            return reply.redirect('/login')
          }
          request.yar.set('user', {
            username: res2.body.username,
            name: res2.body.name,
            email: res2.body.email,
            roles: [
              'admin',
              'super',
            ],
          })
          return reply.redirect('/app/home')
        })
      return null
    })
})

nestedRoute.post('/login', {
  description: 'login',
  tags: ['api', 'user'],
  validate: {
    payload: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
}, async (request, reply) => {
  const username = request.payload.username
  const user = await User.find({
    where: {
      username,
    },
  })
  if (!user) {
    reply(Boom.unauthorized(`no such user: ${username}`))
    return
  }
  const authenticated = user.authenticate(request.payload.password)
  if (authenticated) {
    request.yar.set('user', user)
    reply({
      username: request.payload.username,
      roles: [
        'admin',
      ],
    })
  } else {
    reply(Boom.unauthorized('password mismatch'))
  }
})

nestedRoute.get('/logout', {
  description: 'logout',
  tags: ['api', 'user'],
}, async (request, reply) => {
  request.yar.clear('user')
  reply({ result: true })
})

nestedRoute.get('/users', {
  description: 'admin user list',
  tags: ['api', 'user'],
}, async (request, reply) => {
  reply({ result: await User.findAll() })
})
