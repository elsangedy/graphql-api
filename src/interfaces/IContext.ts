import { IModels } from './IModels'
import { IUserModel } from '../db/user'
import { IDataLoaders } from './IDataLoaders'
import { RequestedFields } from '../utils/ast'

export interface IContext {
  authorization?: string
  models: IModels
  authUser?: IUserModel
  dataloaders?: IDataLoaders
  requestedFields?: RequestedFields
}