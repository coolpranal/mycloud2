module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE } = Sequelize
    return queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
      username: STRING,
      created_at: DATE,
      updated_at: DATE,
    })
  },
  down: queryInterface => (
    queryInterface.dropTable('users')
  ),
}
