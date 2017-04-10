import { schedule } from '../core/scheduler'
import { models } from '../core'
import logger from '../logger'
import { broker } from '../core/broker'

const generateSequence = () => parseInt(new Date().getTime() / 1000, 10)

const { Torrent } = models

schedule.register('torrent.start', async (job, done) => {
  console.log('torrent start')
  done()
})
