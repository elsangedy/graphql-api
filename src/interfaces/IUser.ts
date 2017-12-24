export interface IUser {
  name?: String
  email?: String
  password?: String
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserCreateInput {
  input: {
    name: String
    email: String
    password: String
  }
}

export interface IUserUpdateInput {
  id: String
  input: {
    name: String
    email: String
    password: String
  }
}

export interface IUserUpdatePasswordInput {
  id: String
  input: {
    password: String
  }
}