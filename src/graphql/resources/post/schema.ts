export const postTypes = `
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  input PostInput {
    title: String!
    content: String!
  }
`

export const postQueries = `
  posts(limit: Int, offset: Int): [ Post! ]!
  post(id: ID!): Post
`

export const postMutations = `
  createPost(input: PostInput!): Post
  updatePost(id: ID!, input: PostInput!): Post
  deletePost(id: ID!): Boolean
`