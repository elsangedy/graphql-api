import * as jwt from 'jsonwebtoken'

import { app, db, models, chai, handleError, expect } from './../../test-utils'

import { IUserModel } from '../../../src/db/user'

describe('User', () => {
  let token: string
  let userId: number

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
        userId = users[0].get('id')

        const payload = { sub: userId }

        token = jwt.sign(payload, process.env.JWT_SECRET)
      })
  })

  describe('Queries', () => {
    describe('users', () => {
      it('should return a list of Users', () => {
        const body = {
          query: `
            query {
              users {
                name
                email
              }
            }
          `
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const usersList = res.body.data.users
            expect(res.body.data).to.be.an('object')
            expect(usersList).to.be.an('array')
            expect(usersList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt', 'posts'])
            expect(usersList[0]).to.have.keys(['name', 'email'])
          })
          .catch(handleError)
      })

      it('should paginate a list of Users', () => {
        const body = {
          query: `
            query getUsersList($limit: Int, $offset: Int) {
              users(limit: $limit, offset: $offset) {
                name
                email
                createdAt
              }
            }
          `,
          variables: {
            limit: 2,
            offset: 1
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const usersList = res.body.data.users
            expect(res.body.data).to.be.an('object')
            expect(usersList).to.be.an('array').of.length(2)
            expect(usersList[0]).to.not.have.keys(['id', 'updatedAt', 'posts'])
            expect(usersList[0]).to.have.keys(['name', 'email', 'createdAt'])
          })
          .catch(handleError)
      })
    })

    describe('user', () => {
      it('should return a single User', () => {
        const body = {
          query: `
            query getSingleUser($id: ID!) {
              user(id: $id) {
                id
                name
                email
                posts {
                  title
                }
              }
            }
          `,
          variables: {
            id: userId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const singleUser = res.body.data.user
            expect(res.body.data).to.be.an('object')
            expect(singleUser).to.be.an('object')
            expect(singleUser).to.have.keys(['id', 'name', 'email', 'posts'])
            expect(singleUser.name).to.equal('Peter Quill')
            expect(singleUser.email).to.equal('peter@guardians.com')
          })
          .catch(handleError)
      })

      it('should return only \'name\' attribute', () => {
        const body = {
          query: `
            query getSingleUser($id: ID!) {
              user(id: $id) {
                name
              }
            }
          `,
          variables: {
            id: userId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const singleUser = res.body.data.user
            expect(res.body.data).to.be.an('object')
            expect(singleUser).to.be.an('object')
            expect(singleUser).to.have.key('name')
            expect(singleUser.name).to.equal('Peter Quill')
            expect(singleUser.email).to.be.undefined
            expect(singleUser.createdAt).to.be.undefined
            expect(singleUser.posts).to.be.undefined
          })
          .catch(handleError)
      })

      it('should return an error if User not exists', () => {
        const body = {
          query: `
            query getSingleUser($id: ID!) {
              user(id: $id) {
                name
                email
              }
            }
          `,
          variables: {
            id: '5a3ebe35f04e07e0ad2c3449'
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body.data.user).to.be.null
            expect(res.body.errors).to.be.an('array')
            expect(res.body).to.have.keys(['data', 'errors'])
            expect(res.body.errors[0].message).to.equal('Error: User with id 5a3ebe35f04e07e0ad2c3449 not found!')
          })
          .catch(handleError)
      })
    })
  })

  describe('Mutations', () => {
    describe('createUser', () => {
      it('should create new User', () => {
        const body = {
          query: `
            mutation createNewUser($input: UserCreateInput!) {
              createUser(input: $input) {
                id
                name
                email
              }
            }
          `,
          variables: {
            input: {
              name: 'Drax',
              email: 'drax@guardians.com',
              password: '1234'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const createdUser = res.body.data.createUser
            expect(createdUser).to.be.an('object')
            expect(createdUser.name).to.equal('Drax')
            expect(createdUser.email).to.equal('drax@guardians.com')
            expect(parseInt(createdUser.id)).to.be.a('number')
          })
          .catch(handleError)
      })
    })

    describe('updateUser', () => {
      it('should update an existing User', () => {
        const body = {
          query: `
            mutation updateExistingUser($id: ID!, $input: UserUpdateInput!) {
              updateUser(id: $id, input: $input) {
                name
                email
              }
            }
          `,
          variables: {
            id: userId,
            input: {
              name: 'Star Lord',
              email: 'peter@guardians.com'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const updatedUser = res.body.data.updateUser
            expect(updatedUser).to.be.an('object')
            expect(updatedUser.name).to.equal('Star Lord')
            expect(updatedUser.email).to.equal('peter@guardians.com')
            expect(updatedUser.id).to.be.undefined
          })
          .catch(handleError)
      })

      it('should block operation if token is invalid', () => {
        const body = {
          query: `
            mutation updateExistingUser($id: ID!, $input: UserUpdateInput!) {
              updateUser(id: $id, input: $input) {
                name
                email
              }
            }
          `,
          variables: {
            id: userId,
            input: {
              name: 'Star Lord',
              email: 'peter@guardians.com'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer INVALID_TOKEN')
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body.data.updateUser).to.be.null
            expect(res.body).to.have.keys(['data', 'errors'])
            expect(res.body.errors).to.be.an('array')
            expect(res.body.errors[0].message).to.equal('Unauthorized! Token not provided!')
          })
          .catch(handleError)
      })
    })

    describe('updateUserPassword', () => {
      it('should update the password of an existing User', () => {
        const body = {
          query: `
            mutation updateUserPassword($id: ID!, $input: UserUpdatePasswordInput!) {
              updateUserPassword(id: $id, input: $input) {
                name
                email
              }
            }
          `,
          variables: {
            id: userId,
            input: {
              password: 'peter123'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const updatedUser = res.body.data.updateUserPassword
            expect(updatedUser).to.be.an('object')
            expect(updatedUser.name).to.equal('Peter Quill')
            expect(updatedUser.email).to.equal('peter@guardians.com')
            expect(updatedUser.id).to.be.undefined
          })
          .catch(handleError)
      })
    })

    describe('deleteUser', () => {
      it('should delete an existing User', () => {
        const body = {
          query: `
            mutation deleteUser($id: ID!) {
              deleteUser(id: $id)
            }
          `,
          variables: {
            id: userId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body.data.deleteUser).to.be.true
          })
          .catch(handleError)
      })

      it('should block operation if token is not provided', () => {
        const body = {
          query: `
            mutation deleteUser($id: ID!) {
              deleteUser(id: $id)
            }
          `,
          variables: {
            id: userId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body.errors[0].message).to.equal('Unauthorized! Token not provided!')
          })
          .catch(handleError)
      })
    })
  })
})