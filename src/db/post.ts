import { Document, Schema, Model, model } from 'mongoose'

import { IPost } from '../interfaces/IPost'

export interface IPostModel extends IPost, Document { }

export const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const Post: Model<IPostModel> = model<IPostModel>('Post', PostSchema)