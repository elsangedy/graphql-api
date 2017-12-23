import { userMutations } from './resources/user/schema'

export const Mutation = `
  type Mutation {
    ${userMutations}
  }
`
