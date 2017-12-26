import { postQueries } from './resources/post/schema'
import { userQueries } from './resources/user/schema'

export const Query = `
  type Query {
    ${postQueries}
    ${userQueries}
  }
`
