module.exports = {
  up(queryInterface, Sequelize) {
    const { INTEGER } = Sequelize

    return queryInterface.sequelize.transaction(t => (
      queryInterface.createTable('user_roles', {
        userId: {
          field: 'user_id',
          type: INTEGER,
          references: { model: 'users', key: 'id' },
        },
        roleId: {
          field: 'role_id',
          type: INTEGER,
          references: { model: 'roles', key: 'id' },
        },
      }, {
        transaction: t,
      })
    ))
  },
  down(queryInterface) {
    return queryInterface.dropTable('user_roles')
  },
}
