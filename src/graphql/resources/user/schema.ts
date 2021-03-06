export const userTypes = `
  type User {
    id: ID!
    name: String!
    email: String!
    photo: String
    createdAt: String!
    updatedAt: String!
    posts(limit: Int, offset: Int): [ Post! ]!
  }

  input UserCreateInput {
    name: String!
    email: String!
    password: String!
  }

  input UserUpdateInput {
    name: String!
    email: String!
    photo: String
  }

  input UserUpdatePasswordInput {
    password: String!
  }
`

export const userQueries = `
  users(limit: Int, offset: Int): [ User! ]!
  user(id: ID!): User
`

export const userMutations = `
  createUser(input: UserCreateInput!): User
  updateUser(id: ID!, input: UserUpdateInput!): User
  updateUserPassword(id: ID!, input: UserUpdatePasswordInput!): User
  deleteUser(id: ID!): Boolean
`