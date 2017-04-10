const password = '$2a$10$Fnh/BI5zerG4EGESnBN0B.x7yU6ny4F2g1gFUjoTTlD0fhuip2Fm'

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('roles', [{
      name: 'super',
    }, {
      name: 'admin',
    }, {
      name: 'member',
    }])
      .then(() => {
        return queryInterface.bulkInsert('users', [{
          username: 'super1',
          name: '슈퍼1',
          password,
        }, {
          username: 'admin1',
          name: '어드민1',
          password,
        }, {
          username: 'member1',
          name: '멤버1',
          password,
        }, {
          username: 'member1',
          name: '멤버2',
          password,
        }])
      })
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('roles', null, {})
      .then(() => queryInterface.bulkDelete('roles', null, {
        where: {
          password,
        },
      }))
  },
}

