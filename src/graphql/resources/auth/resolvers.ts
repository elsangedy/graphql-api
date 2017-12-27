import { GraphQLResolveInfo } from 'graphql'

import * as jwt from 'jsonwebtoken'

import { IAuth, IAuthLoginInput } from '../../../interfaces/IAuth'
import { IContext } from '../../../interfaces/IContext'
import { IUserModel } from '../../../db/user'
import { compose } from '../../../utils/compose'
import { checkAuth } from '../../../utils/checkAuth'

export const authResolvers = {
  Query: {
    currentUser: compose(checkAuth)((parent, args, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { authUser, models: { User } } = context

      return Promise.resolve(authUser)
    })
  },

  Mutation: {
    login: (parent, data: IAuthLoginInput, context: IContext, info: GraphQLResolveInfo): Promise<IAuth> => {
      const { models: { User } } = context
      const { input: { email, password } } = data

      return User
        .findOne({ email })
        .exec()
        .then((user: IUserModel) => {
          if (!user || !user.checkPassword(password)) {
            throw new Error('Unauthorized, wrong email or password!')
          }

          const payload = {
            sub: user.get('id')
          }

          return {
            token: jwt.sign(payload, process.env.JWT_SECRET)
          }
        })
    }
  }
}