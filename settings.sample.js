module.exports = {
  version: '0.1',
  apps: [
    'user',
    'torrent',
  ],
  broker: {
    development: {
      url: 'redis://localhost:6379/8',
    },
    production: {
      url: 'redis://localhost:6379/8',
    },
  },
  redis: {
    development: {
      url: 'redis://localhost:6379/8',
    },
    production: {
      url: 'redis://localhost:6379/8',
    },
  },
  schedules: {
    development: [
      ['*/5 * * * * *', 'module1.test'],
    ],
  },
  database: {
    development_pg: {
      url: 'postgres://user@localhost/dbname',
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: false,
      },
    },
    development: {
      storage: 'mycloud.database',
      dialect: 'sqlite',
    },
    test: {
      storage: ':memory:',
      dialect: 'sqlite',
    },
    production: {
      url: process.env.DATABASE_URL,
      logging: false,
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: false,
      },
      use_env_variable: 'DATABASE_URL',
    },
  },
}
