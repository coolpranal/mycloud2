import redis from 'redis'
import settings from '../../../settings'

const brokerUrl = settings.broker[process.env.NODE_ENV].url

export const broker = redis.createClient({
  url: brokerUrl,
})
