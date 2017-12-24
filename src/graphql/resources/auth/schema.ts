export const authTypes = `
  type Auth {
    token: String!
  }

  input AuthLoginInput {
    email: String!
    password: String!
  }
`

export const authMutations = `
  login(input: AuthLoginInput!): Auth
`