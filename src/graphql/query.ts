import { postQueries } from './resources/post/schema'
import { userQueries } from './resources/user/schema'
import { authQueries } from './resources/auth/schema'

export const Query = `
  type Query {
    ${postQueries}
    ${userQueries}
    ${authQueries}
  }
`
