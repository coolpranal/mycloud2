module.exports = {
  up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE, BOOLEAN } = Sequelize

    return queryInterface.createTable('torrents', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
      name: STRING,
      isActive: { field: 'is_active', type: BOOLEAN, defaultValue: true },
      isPending: { field: 'is_pending', type: BOOLEAN, defaultValue: true },
      createdAt: { type: DATE, field: 'created_at' },
      updatedAt: { type: DATE, field: 'updated_at' },
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('torrents')
  },
}
