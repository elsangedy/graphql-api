import { userQueries } from './resources/user/schema'

export const Query = `
  type Query {
    ${userQueries}
  }
`
