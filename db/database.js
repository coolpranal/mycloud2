const settings = require('../settings')

module.exports = settings.database[process.env.NODE_ENV || 'development']
