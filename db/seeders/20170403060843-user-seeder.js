const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up(queryInterface) {
    return bcrypt.hash('1234', null, null, (err, hash) => queryInterface.bulkInsert('users', [{
      username: 'tester',
      password: hash,
    }]))
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {
      where: {
        username: 'tester',
      },
    })
  },
}
