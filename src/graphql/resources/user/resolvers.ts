import { GraphQLResolveInfo } from 'graphql'

import { IContext } from '../../../interfaces/IContext'
import { IIDInput } from '../../../interfaces/IIDInput'
import { IPaginationInput } from '../../../interfaces/IPaginationInput'
import { IUserCreateInput, IUserUpdateInput, IUserUpdatePasswordInput, IUser } from '../../../interfaces/IUser'
import { IUserModel } from '../../../db/user'
import { IModels } from '../../../interfaces/IModels'

import { compose } from '../../../utils/compose'
import { checkAuth } from '../../../utils/checkAuth'
import { throwError } from '../../../utils/throwError'
import { handleError } from '../../../utils/handleError'

export const userResolvers = {
  User: {
    posts: (user: IUserModel, data: IPaginationInput, context: IContext, info: GraphQLResolveInfo) => {
      const { requestedFields, models: { Post } } = context
      const { offset, limit } = data

      return Post
        .find({
          author: user.get('id')
        })
        .select(requestedFields.getFields(info, ['id']))
        .skip(offset)
        .limit(limit)
        .catch(handleError)
    }
  },

  Query: {
    users: compose(checkAuth)((parent, data: IPaginationInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel[]> => {
      const { requestedFields, models: { User } } = context
      const { offset, limit } = data

      return User
        .find()
        .select(requestedFields.getFields(info, ['id'], ['posts']))
        .skip(offset)
        .limit(limit)
        .catch(handleError)
    }),
    user: compose(checkAuth)((parent, data: IIDInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { requestedFields, models: { User } } = context
      const { id } = data

      return User
        .findById(id)
        .select(requestedFields.getFields(info, ['id'], ['posts']))
        .then((u: IUserModel) => {
          throwError(!u, `User with id ${id} not found!`)

          return u
        })
        .catch(handleError)
    })
  },

  Mutation: {
    createUser: compose(checkAuth)((parent, data: IUserCreateInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { models: { User } } = context
      const { input: { name, email, password } } = data

      const u = new User({
        name,
        email,
        password
      })

      return u
        .save()
        .catch(handleError)
    }),
    updateUser: compose(checkAuth)((parent, data: IUserUpdateInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { models: { User } } = context
      const { id, input: { name, email } } = data

      return User
        .findById(id)
        .then((u: IUserModel) => {
          throwError(!u, `User with id ${id} not found!`)

          return u
        })
        .then((u: IUserModel) => {
          u.name = name
          u.email = email

          return u
            .save()
            .catch(handleError)
        })
    }),
    updateUserPassword: compose(checkAuth)((parent, data: IUserUpdatePasswordInput, context: IContext, info: GraphQLResolveInfo): Promise<IUserModel> => {
      const { models: { User } } = context
      const { id, input: { password } } = data

      return User
        .findById(id)
        .then((u: IUserModel) => {
          throwError(!u, `User with id ${id} not found!`)

          return u
        })
        .then((u: IUserModel) => {
          u.password = password

          return u
            .save()
            .catch(handleError)
        })
    }),
    deleteUser: compose(checkAuth)((parent, data: IIDInput, context: IContext, info: GraphQLResolveInfo) => {
      const { models: { User } } = context
      const { id } = data

      return User
        .findByIdAndRemove(id)
        .then((u: IUserModel) => {
          throwError(!u, `User with id ${id} not found!`)

          return u
        })
        .then((u: IUserModel) => !!u)
        .catch(handleError)
    })
  }
}