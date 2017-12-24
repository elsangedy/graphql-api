import { IModels } from './IModels'

export interface IContext {
  models: IModels
  authorization?: string
  authUser?: {
    id: string
    email: string
  }
}