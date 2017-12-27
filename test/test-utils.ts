import * as chai from 'chai'

const chaiHttp = require('chai-http')

import app from '../src/app'
import db from '../src/db'

import { IModels } from '../src/interfaces/IModels'
import { IUserModel, UserSchema } from '../src/db/user'
import { IPostModel, PostSchema } from '../src/db/post'

chai.use(chaiHttp)

const expect = chai.expect

let models: IModels

const handleError = (error) => {
  const message: string = (error.response) ? error.response.res.text : error.message || error
  return Promise.reject(`${error.name}: ${message}`)
}

models = new Object()
models.User = db.model<IUserModel>('User', UserSchema)
models.Post = db.model<IPostModel>('Post', PostSchema)

export {
  app,
  db,
  models,
  chai,
  expect,
  handleError
}