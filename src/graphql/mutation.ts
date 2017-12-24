import { authMutations } from './resources/auth/schema'
import { userMutations } from './resources/user/schema'

export const Mutation = `
  type Mutation {
    ${authMutations}
    ${userMutations}
  }
`
