import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as jwt from 'jsonwebtoken'

import db from './db'

import schema from './graphql/schema'

import { IModels } from './interfaces/IModels'

import { RequestedFields } from './utils/ast'
import { DataLoaderFactory } from './utils/dataloader'

import { IUserModel, UserSchema } from './db/user'
import { IPostModel, PostSchema } from './db/post'

class App {
  public express: express.Application

  private models: IModels

  private requestedFields: RequestedFields
  private dataLoaderFactory: DataLoaderFactory

  constructor() {
    this.express = express()
    this.init()
  }

  private init(): void {
    this.middlewares()

    this.database()

    this.requestedFields = new RequestedFields()
    this.dataLoaderFactory = new DataLoaderFactory(this.models, this.requestedFields)

    this.graphql()
  }

  private middlewares() {
    this.express.use(cors({
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    }))

    this.express.use(helmet())

    this.express.use(compression())
  }

  private database(): void {
    this.models = new Object()

    this.models.User = db.model<IUserModel>('User', UserSchema)
    this.models.Post = db.model<IPostModel>('Post', PostSchema)
  }

  private graphql(): void {
    this.express.use('/graphql',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req['context'] = {}

        next()
      },
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authorization: string = req.get('authorization')
        const token: string = authorization ? authorization.split(' ')[1] : undefined

        req['context']['authorization'] = authorization

        if (!token) return next()

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
          if (err) return next()

          this.models.User
            .findById(decoded.sub)
            .then((user: IUserModel) => {
              if (user) req['context']['authUser'] = user

              return next()
            })
        })
      },
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req['context']['models'] = this.models
        req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders()
        req['context']['requestedFields'] = this.requestedFields

        next()
      },
      graphqlHTTP((req) => ({
        schema,
        graphiql: process.env.NODE_ENV === 'development',
        context: req['context']
      }))
    )
  }
}

export default new App().express