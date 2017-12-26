import { authMutations } from './resources/auth/schema'
import { postMutations } from './resources/post/schema'
import { userMutations } from './resources/user/schema'

export const Mutation = `
  type Mutation {
    ${authMutations}
    ${postMutations}
    ${userMutations}
  }
`
