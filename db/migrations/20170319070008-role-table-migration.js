module.exports = {
  up(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize
    const { STRING, INTEGER, BOOLEAN, DATE } = Sequelize
    return sequelize.transaction(t => (
      queryInterface.createTable('roles', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
        name: STRING,
        createdAt: { type: DATE, field: 'created_at' },
        updatedAt: { type: DATE, field: 'updated_at' },
      },
        {
          transaction: t,
        })
        .then(() => {
          queryInterface.addColumn('users', 'email', {
            type: STRING,
          },
            {
              transaction: t,
            })
        })
        .then(() => {
          queryInterface.addColumn('users', 'name', {
            type: STRING,
          },
            {
              transaction: t,
            })
        })
      // .then(() => {
      //   const password = '$2a$10$Fnh/BI5zerG4EGESnBN0B.x7yU6ny4F2g1gFUjoTTlD0fhuip2Fm'
      //   return queryInterface.sequelize.query(
      //     `INSERT INTO users
      //     (username, name, password, email, created_at, updated_at)
      //     VALUES
      //     ('super1', '슈퍼1', '${password}',
      // 'super1@woo1.com', current_timestamp, current_timestamp),
      //     ('admin1', '어드민1', '${password}',
      // 'admin1@woo1.com', current_timestamp, current_timestamp),
      //     ('member1', '멤버1', '${password}',
      // 'member1@woo1.com', current_timestamp, current_timestamp),
      //     ('member2', '멤버2', '${password}',
      // 'member2@woo1.com', current_timestamp, current_timestamp);
      //     `, {
      //       transaction: t,
      //     },
      //   )
      // })
    ))
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('roles')
      .then(() => queryInterface.removeColumn('users', 'name'))
      .then(() => queryInterface.removeColumn('users', 'email'))
      .then(() => (
        queryInterface.sequelize.query(
          `DELETE FROM users
         WHERE username IN ('super1', 'admin1', 'member1', 'member2');`)
      ))
  },
}
