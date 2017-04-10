/* eslint prefer-arrow-callback: "off" */

import { expect } from 'chai'
import { before, beforeEach, describe, it } from 'mocha'
import { models, sequelize } from '../core'

const { User, Role, UserRole } = models

before(async function () {
  await sequelize.sync({ force: true })
})

describe('UserRoleTest', () => {
  let user
  let adminRole
  let superRole

  beforeEach(async function () {
    user = await User.create({
      username: 'user1',
      password: 'password1',
      passwordConfirmation: 'password1',
      email: 'email@email.com',
      name: 'name1',
    })
    adminRole = await Role.create({
      name: 'admin',
    })
    superRole = await Role.create({
      name: 'super',
    })
  })

  it('add a role to user', async function () {
    const result = await user.addRole(adminRole)
    const userRoles = await UserRole.findAll()
  })
})
