export interface IUser {
  name?: String
  email?: String
  password?: String
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserCreateInput {
  input: {
    name: string
    email: string
    password: string
  }
}

export interface IUserUpdateInput {
  id: string
  input: {
    name: string
    email: string
    password: string
  }
}

export interface IUserUpdatePasswordInput {
  id: string
  input: {
    password: string
  }
}