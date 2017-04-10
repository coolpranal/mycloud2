export default (sequelize, DataTypes) => {
  const { INTEGER, STRING, DATE, BOOLEAN } = DataTypes

  //
  // torrent
  //

  const Torrent = sequelize.define('torrents', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
    name: STRING,
    isActive: { field: 'is_active', type: BOOLEAN, defaultValue: true },
    isPending: { field: 'is_pending', type: BOOLEAN, defaultValue: true },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
  }, {
    classMethods: {
      associate: (models) => {
      },
    },
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  })


  return {
    Torrent,
  }
}
