import * as DataLoader from 'dataloader'

import { RequestedFields } from './ast'
import { IUserModel } from '../db/user'
import { batchUsers } from '../graphql/resources/user/loaders'
import { IDataLoaders } from '../interfaces/IDataLoaders'
import { IDataLoaderParam } from '../interfaces/IDataLoaderParam'
import { IModels } from '../interfaces/IModels'

export class DataLoaderFactory {
  constructor(
    private modes: IModels,
    private requestedFields: RequestedFields
  ) { }

  getLoaders(): IDataLoaders {
    return {
      userLoader: new DataLoader<IDataLoaderParam<string>, IUserModel>(
        (params: IDataLoaderParam<string>[]) => batchUsers(this.modes.User, params, this.requestedFields),
        { cacheKeyFn: (param: IDataLoaderParam<string[]>) => param.key }
      )
    }
  }
}