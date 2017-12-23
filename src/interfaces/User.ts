export interface User {
  id: string
  name: string
  email: string
  password?: string
  photo?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserCreateInput {
  input: {
    name: string
    email: string
    password: string
  }
}

export interface UserUpdateInput {
  id: string,
  input: {
    name: string
    email: string
    photo?: string
  }
}

export interface UserUpdatePasswordInput {
  id: string,
  input: {
    password: string
  }
}
