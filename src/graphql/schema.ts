import { makeExecutableSchema } from 'graphql-tools'

const SchemaDefinition = `
  type Schema {
      query: Query
  }

  type User {
    id: ID!
    name: String!
  }

  type Query {
    users(limit: Int, offset: Int): [ User! ]!
  }
`

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
  ],
  resolvers: {
    Query: {
      users: (parent, { limit = 10, offset = 0 }) => ([])
    }
  }
})