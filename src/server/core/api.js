import Boom from 'boom'
// import cheerio from 'cheerio'
// import superagent from 'superagent'
import { route } from '../core'

const nestedRoute = route.nested('/api')

route.get('/', { }, async (request, reply) => {
  reply.redirect('/app/home')
})

route.get('/favicon.ico', {}, {
  file: `${__dirname}/../static/favicon.ico`,
})

route.get('/static/{p*}', {}, {
  directory: {
    path: `${__dirname}/../../../static`,
  },
})

route.any('/api/{p*}', {}, async (request, reply) => {
  reply(Boom.notFound('NOT FOUND'))
})

route.get('/api/home', {
  description: '위키로부터 homepage 가져오기',
  tags: ['api'],
  // auth: 'superRequired',
  cache: {
    expiresIn: 30 * 1000,
    privacy: 'private',
  },
}, (request, reply) => {
  reply({})
  // superagent.get('http://git.woo1.kr/woo/general/wikis/home')
  //   .set('cookie', 'issuable_sort=id_desc; _gitlab_session=6c2f887905bda418f7c1155b5688ed18')
  //   .end((err, res) => {
  //     const $ = cheerio.load(res.text)
  //     $('div.wiki > ul').addClass('list-group')
  //     $('div.wiki > ul > li').addClass('list-group-item')
  //     let content = $('div.wiki').html()
  //     content = content.replace(/<h1>/g, '<h3>')
  //     content = content.replace(/<h2>/g, '<h4>')

  //     let contents = content.split('<hr>')
  //     contents = contents.map(it => `<div class="col-md-3 col-sm-6">${it}</div>`).join('')
  //     contents = `<div class="row">${contents}</div>`
  //     reply(contents)
  //   })
})
