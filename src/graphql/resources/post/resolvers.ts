import { GraphQLResolveInfo } from 'graphql'

import { IContext } from '../../../interfaces/IContext'
import { IIDInput } from '../../../interfaces/IIDInput'
import { IModels } from '../../../interfaces/IModels'
import { IPaginationInput } from '../../../interfaces/IPaginationInput'
import { IPostCreateInput, IPostUpdateInput, IPost } from '../../../interfaces/IPost'
import { Post, IPostModel } from '../../../db/post'
import { IUserModel } from '../../../db/user'

import { compose } from '../../../utils/compose'
import { checkAuth } from '../../../utils/checkAuth'
import { throwError } from '../../../utils/throwError'
import { handleError } from '../../../utils/handleError'

export const postResolvers = {
  Post: {
    author: (post: IPostModel, data, context: IContext, info: GraphQLResolveInfo): Promise<void | IUserModel> => {
      const { models: { User }, dataloaders: { userLoader } } = context

      return userLoader
        .load({
          key: post.get('author').toString(),
          info
        })
        .catch(handleError)
    }
  },

  Query: {
    posts: compose(checkAuth)((parent, data: IPaginationInput, context: IContext, info: GraphQLResolveInfo): Promise<IPostModel[]> => {
      const { requestedFields, models: { Post } } = context
      const { offset, limit } = data

      return Post
        .find()
        .select(requestedFields.getFields(info, ['id']))
        .skip(offset)
        .limit(limit)
        .catch(handleError)
    }),
    post: compose(checkAuth)((parent, data: IIDInput, context: IContext, info: GraphQLResolveInfo): Promise<IPostModel> => {
      const { requestedFields, models: { Post } } = context
      const { id } = data

      return Post
        .findById(id)
        .select(requestedFields.getFields(info, ['id']))
        .then((p: IPostModel) => {
          throwError(!p, `Post with id ${id} not found!`)

          return p
        })
        .catch(handleError)
    })
  },

  Mutation: {
    createPost: compose(checkAuth)((parent, data: IPostCreateInput, context: IContext, info: GraphQLResolveInfo): Promise<IPostModel> => {
      const { authUser, models: { Post } } = context
      const { input: { title, content } } = data

      const p = new Post({
        title,
        content,
        author: authUser.get('id')
      })

      return p
        .save()
        .catch(handleError)
    }),
    updatePost: compose(checkAuth)((parent, data: IPostUpdateInput, context: IContext, info: GraphQLResolveInfo): Promise<IPostModel> => {
      const { models: { Post } } = context
      const { id, input: { title, content } } = data

      return Post
        .findById(id)
        .then((p: IPostModel) => {
          throwError(!p, `Post with id ${id} not found!`)

          return p
        })
        .then((p: IPostModel) => {
          p.title = title
          p.content = content

          return p
            .save()
            .catch(handleError)
        })
    }),
    deletePost: compose(checkAuth)((parent, data: IIDInput, context: IContext, info: GraphQLResolveInfo) => {
      const { models: { Post } } = context
      const { id } = data

      return Post
        .findByIdAndRemove(id)
        .then((p: IPostModel) => {
          throwError(!p, `Post with id ${id} not found!`)

          return p
        })
        .then((p: IPostModel) => !!p)
        .catch(handleError)
    })
  }
}