import { GraphQLFieldResolver } from 'graphql'

import * as jwt from 'jsonwebtoken'

import { ComposableResolver } from './compose'

import { IContext } from '../interfaces/IContext'

export const checkAuth: ComposableResolver<any, IContext> =
  (resolver: GraphQLFieldResolver<any, IContext>): GraphQLFieldResolver<any, IContext> =>
    (parent, args, context: IContext, info) => {
      if (!context.authUser) {
        throw new Error('Unauthorized! Token not provided!')
      }

      return resolver(parent, args, context, info)
    }