import { Model } from 'mongoose'

import { IUserModel } from '../db/user'

export interface IModels {
  User?: Model<IUserModel>
}