
import { UserModel, IUserModel } from '../../../db/user'
import { IDataLoaderParam } from '../../../interfaces/IDataLoaderParam'
import { RequestedFields } from '../../../utils/ast'

export const batchUsers = (User: UserModel, params: IDataLoaderParam<string>[], requestedFields: RequestedFields): Promise<IUserModel[]> => {
  const ids: string[] = params.map((param) => param.key)

  let query = User
    .find({
      _id: {
        $in: ids
      }
    })

  if (params[0].info) query = query.select(requestedFields.getFields(params[0].info, ['id'], ['posts']))

  return query.exec()
}
