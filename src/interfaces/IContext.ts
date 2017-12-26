import { IModels } from './IModels'
import { RequestedFields } from '../utils/ast'
import { IUserModel } from '../db/user'

export interface IContext {
  models: IModels
  authorization?: string
  authUser?: IUserModel
  requestedFields?: RequestedFields
}