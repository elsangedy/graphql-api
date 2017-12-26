import { makeExecutableSchema } from 'graphql-tools'

import { merge } from 'lodash'

import { Query } from './query'
import { Mutation } from './mutation'

import { authTypes } from './resources/auth/schema'
import { postTypes } from './resources/post/schema'
import { userTypes } from './resources/user/schema'

import { authResolvers } from './resources/auth/resolvers'
import { postResolvers } from './resources/post/resolvers'
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
  authTypes,
  postTypes,
  userTypes
]

const resolvers = merge(
  authResolvers,
  postResolvers,
  userResolvers
)

export default makeExecutableSchema({
  typeDefs,
  resolvers
})