export interface IAuth {
  token?: String
}

export interface IAuthLoginInput {
  input: {
    email: string
    password: string
  }
}