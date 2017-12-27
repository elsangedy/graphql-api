import * as jwt from 'jsonwebtoken'

import { models, chai, handleError, expect } from './../../test-utils'

import { IUserModel } from '../../../src/db/user'
import { batchUsers } from '../../../src/graphql/resources/user/loaders'
import { IDataLoaderParam } from '../../../src/interfaces/IDataLoaderParam'
import { RequestedFields } from '../../../src/utils/ast'

describe('User', () => {
  let params: IDataLoaderParam<string>[]
  let requestedFields: RequestedFields

  beforeEach(() => {
    return models.Post.remove({})
      .then(() => models.User.remove({}))
      .then(() => models.User.insertMany([
        {
          name: 'Peter Quill',
          email: 'peter@guardians.com',
          password: '1234'
        },
        {
          name: 'Gamora',
          email: 'gamora@guardians.com',
          password: '1234'
        },
        {
          name: 'Groot',
          email: 'groot@guardians.com',
          password: '1234'
        }
      ]))
      .then((users: IUserModel[]) => {
        requestedFields = new RequestedFields()

        params = users.map((user: IUserModel): IDataLoaderParam<string> => ({
          key: user.get('id').toString()
        }))
      })
  })

  describe('Loaders', () => {
    describe('batchUsers', () => {
      it('should return a list of Users', () => {
        batchUsers(models.User, params, requestedFields)
          .then((users: IUserModel[]) => {
            expect(users).to.be.an('array').of.length(3)
          })
      })
    })
  })
})