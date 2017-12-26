export interface IPost {
  title?: String
  content?: String
  author?: String
  createdAt?: Date
  updatedAt?: Date
}

export interface IPostCreateInput {
  input: {
    title: string
    content: string
  }
}

export interface IPostUpdateInput {
  id: string
  input: {
    title: string
    content: string
  }
}