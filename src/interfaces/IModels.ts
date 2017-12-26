import { Model } from 'mongoose'

import { IUserModel } from '../db/user'
import { IPostModel } from '../db/post'

export interface IModels {
  User?: Model<IUserModel>
  Post?: Model<IPostModel>
}