// @flow

import kue from 'kue-scheduler'

import settings from '../../../settings'

const redisUrl = settings.redis[process.env.NODE_ENV].url
const jobs = kue.createQueue({
  redis: redisUrl,
})

// get schedules from settings
let schedules = []
try {
  schedules = settings.schedules[process.env.NODE_ENV]
} catch (e) {
  schedules = []
}
schedules = schedules || []

// make schedule
const schedule = {
  register(name: string, callback: () => {}) {
    return jobs.process(name, 10, callback)
  },
  now(name: string, options: Object) {
    return jobs.createJob(name, options)
      .removeOnComplete(true)
      .delay(0)
      .save()
  },
}

// initialize
jobs.clear((err, response) => {
  schedules.forEach((sche) => {
    const job = jobs.createJob(sche[1], {})
      .removeOnComplete(true)
      .unique(sche[1])
    jobs.every(sche[0], job)
  })
})

export {
  schedule,
}
