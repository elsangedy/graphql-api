import * as jwt from 'jsonwebtoken'

import { app, db, models, chai, handleError, expect } from './../../test-utils'

import { IUserModel } from '../../../src/db/user'

describe('Auth', () => {
  let token: string
  let userId: number

  beforeEach(() => {
    return models.Post.remove({})
      .then(() => models.User.remove({}))
      .then(() => models.User.create({
        name: 'Peter Quill',
        email: 'peter@guardians.com',
        password: '1234'
      }))
      .then((user: IUserModel) => {
        userId = user.get('id')

        const payload = { sub: userId }

        token = jwt.sign(payload, process.env.JWT_SECRET)
      })
  })

  describe('Queries', () => {
    describe('currentUser', () => {
      it('should return the User owner of the token', () => {
        const body = {
          query: `
          query {
            currentUser {
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
            const currentUser = res.body.data.currentUser
            expect(currentUser).to.be.an('object')
            expect(currentUser).to.have.keys(['name', 'email'])
            expect(currentUser.name).to.equal('Peter Quill')
            expect(currentUser.email).to.equal('peter@guardians.com')
          })
          .catch(handleError)
      })
    })
  })

  describe('Mutations', () => {
    describe('login', () => {
      it('should return a new valid token', () => {
        const body = {
          query: `
            mutation createNewToken($input: AuthLoginInput!) {
              login(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: 'peter@guardians.com',
              password: '1234'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body.data).to.have.key('login')
            expect(res.body.data.login).to.have.key('token')
            expect(res.body.data.login.token).to.be.string
            expect(res.body.errors).to.be.undefined
          })
          .catch(handleError)
      })

      it('should return an error if the password is incorrect', () => {
        const body = {
          query: `
            mutation createNewToken($input: AuthLoginInput!) {
              login(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: 'peter@guardians.com',
              password: 'WRONG_PASSWORD'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body).to.have.keys(['data', 'errors'])
            expect(res.body.data).to.have.key('login')
            expect(res.body.data.login).to.be.null
            expect(res.body.errors).to.be.an('array').with.length(1)
            expect(res.body.errors[0].message).to.equal('Unauthorized, wrong email or password!')
          })
          .catch(handleError)
      })

      it('should return an error when the email not exists', () => {
        const body = {
          query: `
            mutation createNewToken($input: AuthLoginInput!) {
              login(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: 'wrong@wrong.com',
              password: '1234'
            }
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body).to.have.keys(['data', 'errors'])
            expect(res.body.data).to.have.key('login')
            expect(res.body.data.login).to.be.null
            expect(res.body.errors).to.be.an('array').with.length(1)
            expect(res.body.errors[0].message).to.equal('Unauthorized, wrong email or password!')
          })
          .catch(handleError)
      })
    })
  })
})