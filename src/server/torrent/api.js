import Joi from 'joi'
import Path from 'path'
import Fs from 'fs'
import { route, models, sequelize } from '../core'
import { schedule } from '../core/scheduler'
import { broker } from '../core/broker'
import settings from '../../../settings'

const nestedRoute = route.nested('/api/torrent')
const { Torrent } = models

nestedRoute.get('/entries', {
  tags: ['api', 'torrent'],
  // auth: 'adminRequired',
}, async (request, reply) => {
  reply({
    entries: await Torrent.findAll({
      order: ['id'],
    }),
  })
})

nestedRoute.post('/torrents', {
  tags: ['api', 'torrent'],
  // auth: 'adminRequired',
  payload: {
    output: 'stream',
    parse: true,
    allow: 'multipart/form-data',
  },
}, async (request, reply) => {
  const data = request.payload;
  if (data.file) {
    const name = data.file.hapi.filename
    const path = `${settings.uploads[process.env.NODE_ENV]}/${name}`

    Fs.mkdir(Path.dirname(path), () => {
      const file = Fs.createWriteStream(path)

      file.on('error', (err) => {
        console.error(err)
      })

      data.file.pipe(file)

      data.file.on('end', (err) => {
        const ret = {
          filename: data.file.hapi.filename,
          headers: data.file.hapi.headers,
        }
        reply(JSON.stringify(ret))
      })
    })
  }
})

