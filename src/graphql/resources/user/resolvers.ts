import { GraphQLResolveInfo } from 'graphql'

import { IContext } from '../../../interfaces/IContext'
import { IIDInput } from '../../../interfaces/IIDInput'
import { IPaginationInput } from '../../../interfaces/IPaginationInput'
import { IUserCreateInput, IUserUpdateInput, IUserUpdatePasswordInput, IUser } from '../../../interfaces/IUser'
import { User, IUserModel } from '../../../db/user'
import { IModels } from '../../../interfaces/IModels'

import { compose } from '../../../utils/compose'
import { checkAuth } from '../../../utils/checkAuth'

export const userResolvers = {
  Query: {
    users: compose(checkAuth)((parent, data: IPaginationInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel[]> => {
      const { requestedFields, models: { User } } = context
      const { offset, limit } = data

      return User
        .find()
        .select(requestedFields.getFields(info, ['id'], ['posts']))
        .skip(offset)
        .limit(limit)
        .exec()
    }),
    user: (parent, data: IIDInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { requestedFields, models: { User } } = context
      const { id } = data

      return User
        .findById(id)
        .select(requestedFields.getFields(info, ['id'], ['posts']))
        .exec()
    }
  },

  Mutation: {
    createUser: (parent, data: IUserCreateInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { models: { User } } = context
      const { input: { name, email, password } } = data

      const u = new User({
        name,
        email,
        password
      })

      return u.save()
    },
    updateUser: (parent, data: IUserUpdateInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { models: { User } } = context
      const { id, input: { name, email } } = data

      return User.findById(id).then((u: IUserModel) => {
        u.name = name || u.name
        u.email = email || u.email

        return u.save()
      })
    },
    updateUserPassword: (parent, data: IUserUpdatePasswordInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { models: { User } } = context
      const { id, input: { password } } = data

      return User.findById(id).then((u: IUserModel) => {
        u.password = password || u.password

        return u.save()
      })
    },
    deleteUser: (parent, data: IIDInput, context: IContext, info: GraphQLResolveInfo) => {
      const { models: { User } } = context
      const { id } = data

      return User.findByIdAndRemove(id).then((u: IUserModel) => !!u)
    },
  }
}