import * as graphqlFields from 'graphql-fields'
import { GraphQLResolveInfo } from 'graphql'
import { difference, union } from 'lodash'

export class RequestedFields {
  getFields(info: GraphQLResolveInfo, keep?: string[], exclude?: string[]): string[] {
    let fields: string[] = Object.keys(graphqlFields(info))

    fields = (keep) ? union<string>(fields, keep) : fields
    fields = (exclude) ? difference<string>(fields, exclude) : fields

    return fields
  }
}