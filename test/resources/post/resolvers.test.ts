import * as jwt from 'jsonwebtoken'

import { app, db, models, chai, handleError, expect } from './../../test-utils'

import { IUserModel } from '../../../src/db/user'
import { IPostModel } from '../../../src/db/post'

describe('Post', () => {
  let token: string
  let userId: number
  let postId: number

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

        return user
      })
      .then((user: IUserModel) => models.Post.insertMany([
        {
          title: 'Post 1',
          content: 'Content of post 1',
          author: user.get('id')
        },
        {
          title: 'Post 2',
          content: 'Content of post 2',
          author: user.get('id')
        },
        {
          title: 'Post 3',
          content: 'Content of post 3',
          author: user.get('id')
        }
      ]))
      .then((posts: IPostModel[]) => {
        postId = posts[0].get('id').toString()
      })
  })

  describe('Queries', () => {
    describe('posts', () => {
      it('should return a list of Posts', () => {
        const body = {
          query: `
            query {
              posts {
                title
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
            const postsList = res.body.data.posts
            expect(res.body.data).to.be.an('object')
            expect(postsList).to.be.an('array')
            expect(postsList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt', 'author'])
            expect(postsList[0]).to.have.keys(['title'])
          })
          .catch(handleError)
      })

      it('should paginate a list of Posts', () => {
        const body = {
          query: `
            query getPostsList($limit: Int, $offset: Int) {
              posts(limit: $limit, offset: $offset) {
                title
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
            const postsList = res.body.data.posts
            expect(res.body.data).to.be.an('object')
            expect(postsList).to.be.an('array').of.length(2)
            expect(postsList[0]).to.not.have.keys(['id', 'updatedAt', 'author'])
            expect(postsList[0]).to.have.keys(['title', 'createdAt'])
          })
          .catch(handleError)
      })
    })

    describe('post', () => {
      it('should return a single Post', () => {
        const body = {
          query: `
            query getSinglePost($id: ID!) {
              post(id: $id) {
                id
                title
                content
                author {
                  name
                }
              }
            }
          `,
          variables: {
            id: postId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const singlePost = res.body.data.post
            expect(res.body.data).to.be.an('object')
            expect(singlePost).to.be.an('object')
            expect(singlePost).to.have.keys(['id', 'title', 'content', 'author'])
            expect(singlePost.title).to.equal('Post 1')
            expect(singlePost.content).to.equal('Content of post 1')
          })
          .catch(handleError)
      })

      it('should return only \'title\' attribute', () => {
        const body = {
          query: `
            query getSinglePost($id: ID!) {
              post(id: $id) {
                title
              }
            }
          `,
          variables: {
            id: postId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            const singlePost = res.body.data.post
            expect(res.body.data).to.be.an('object')
            expect(singlePost).to.be.an('object')
            expect(singlePost).to.have.key('title')
            expect(singlePost.title).to.equal('Post 1')
            expect(singlePost.content).to.be.undefined
            expect(singlePost.createdAt).to.be.undefined
            expect(singlePost.author).to.be.undefined
          })
          .catch(handleError)
      })

      it('should return an error if Post not exists', () => {
        const body = {
          query: `
              query getSinglePost($id: ID!) {
                post(id: $id) {
                  title
                  content
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
            expect(res.body.data.post).to.be.null
            expect(res.body.errors).to.be.an('array')
            expect(res.body).to.have.keys(['data', 'errors'])
            expect(res.body.errors[0].message).to.equal('Error: Post with id 5a3ebe35f04e07e0ad2c3449 not found!')
          })
          .catch(handleError)
      })
    })
  })

  describe('Mutations', () => {
    describe('createPost', () => {
      it('should create new Post', () => {
        const body = {
          query: `
            mutation createNewPost($input: PostInput!) {
              createPost(input: $input) {
                id
                title
                content
              }
            }
          `,
          variables: {
            input: {
              title: 'Post 4',
              content: 'Content of post 4'
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
            const createdPost = res.body.data.createPost
            expect(createdPost).to.be.an('object')
            expect(createdPost.title).to.equal('Post 4')
            expect(createdPost.content).to.equal('Content of post 4')
            expect(parseInt(createdPost.id)).to.be.a('number')
          })
          .catch(handleError)
      })
    })

    describe('updatePost', () => {
      it('should update an existing Post', () => {
        const body = {
          query: `
            mutation updateExistingPost($id: ID!, $input: PostInput!) {
              updatePost(id: $id, input: $input) {
                title
                content
              }
            }
          `,
          variables: {
            id: postId,
            input: {
              title: 'Post 1.1',
              content: 'Content of post 1.1'
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
            const updatedPost = res.body.data.updatePost
            expect(updatedPost).to.be.an('object')
            expect(updatedPost.title).to.equal('Post 1.1')
            expect(updatedPost.content).to.equal('Content of post 1.1')
            expect(updatedPost.id).to.be.undefined
          })
          .catch(handleError)
      })

      it('should block operation if token is invalid', () => {
        const body = {
          query: `
            mutation updateExistingPost($id: ID!, $input: PostInput!) {
              updatePost(id: $id, input: $input) {
                title
                content
              }
            }
          `,
          variables: {
            id: postId,
            input: {
              title: 'Post 1.1',
              content: 'Content of post 1.1'
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
            expect(res.body.data.updatePost).to.be.null
            expect(res.body).to.have.keys(['data', 'errors'])
            expect(res.body.errors).to.be.an('array')
            expect(res.body.errors[0].message).to.equal('Unauthorized! Token not provided!')
          })
          .catch(handleError)
      })
    })

    describe('deletePost', () => {
      it('should delete an existing Post', () => {
        const body = {
          query: `
            mutation deletePost($id: ID!) {
              deletePost(id: $id)
            }
          `,
          variables: {
            id: postId
          }
        }

        return chai
          .request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(JSON.stringify(body))
          .then((res) => {
            expect(res.body.data.deletePost).to.be.true
          })
          .catch(handleError)
      })

      it('should block operation if token is not provided', () => {
        const body = {
          query: `
            mutation deletePost($id: ID!) {
              deletePost(id: $id)
            }
          `,
          variables: {
            id: postId
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