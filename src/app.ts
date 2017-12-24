import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'

import { IModels } from './interfaces/IModels'

import schema from './graphql/schema'
import db from './db'

import { IUserModel, UserSchema } from './db/user'

class App {
  public express: express.Application

  private models: IModels

  constructor() {
    this.express = express()
    this.init()
  }

  private init(): void {
    this.database()

    this.graphql()
  }

  private database(): void {
    this.models = new Object()

    this.models.User = db.model<IUserModel>('User', UserSchema)
  }

  private graphql(): void {
    this.express.use('/graphql',
      (req, res, next) => {
        req['context'] = {}
        req['context']['models'] = this.models

        next()
      },
      graphqlHTTP((req) => ({
        schema,
        graphiql: process.env.NODE_ENV === 'development',
        context: req['context']
      }))
    )
  }

  public server(): void {
    this.express.listen(3000, (error) => {
      if (error) {
        console.error('ERROR - Unable to start server.')
      } else {
        console.info(`INFO - Server started on port 3000.`)
      }
    })
  }
}

export default new App()