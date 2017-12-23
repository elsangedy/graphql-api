import { GraphQLResolveInfo } from 'graphql'

import { IDInput } from '../../../interfaces/IDInput'
import { PaginationInput } from '../../../interfaces/PaginationInput'
import { UserCreateInput, UserUpdateInput, UserUpdatePasswordInput } from '../../../interfaces/User'

const userDefault = {
  id: 1,
  name: 'User test'
}

export const userResolvers = {
  Query: {
    users: (parent, data: PaginationInput, context, info: GraphQLResolveInfo) => ([userDefault]),
    user: (parent, data: IDInput, context, info: GraphQLResolveInfo) => (userDefault)
  },

  Mutation: {
    createUser: (parent, data: UserCreateInput, context, info: GraphQLResolveInfo) => (userDefault),
    updateUser: (parent, data: UserUpdateInput, context, info: GraphQLResolveInfo) => (userDefault),
    updateUserPassword: (parent, data: UserUpdatePasswordInput, context, info: GraphQLResolveInfo): boolean => (true),
    deleteUser: (parent, data: IDInput, context, info: GraphQLResolveInfo): boolean => (true),
  }
}