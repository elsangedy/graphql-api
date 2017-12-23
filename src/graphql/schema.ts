import { makeExecutableSchema } from 'graphql-tools'

import { merge } from 'lodash'

import { Query } from './query'
import { Mutation } from './mutation'

import { userTypes } from './resources/user/schema'
import { userResolvers } from './resources/user/resolvers'

const SchemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`

const typeDefs = [
  SchemaDefinition,
  Query,
  Mutation,
  userTypes
]

const resolvers = merge(
  userResolvers
)

export default makeExecutableSchema({
  typeDefs,
  resolvers
})