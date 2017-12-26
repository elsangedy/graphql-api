import * as DataLoader from 'dataloader'

import { IDataLoaderParam } from './IDataLoaderParam'

import { IUserModel } from '../db/user'

export interface IDataLoaders {
  userLoader: DataLoader<IDataLoaderParam<string>, IUserModel>
}