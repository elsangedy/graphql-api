import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as jwt from 'jsonwebtoken'

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
    this.middlewares()

    this.database()

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
  }

  private graphql(): void {
    this.express.use('/graphql',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req['context'] = {}

        next()
      },
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authorization: string = req.get('authorization')
        // const token: string = authorization ? authorization.split(' ')[1] : undefined
        const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YTNmZDk5ODI5NGRmYzFhYTUwN2VmNDIiLCJpYXQiOjE1MTQxNTU0NzF9.UAnBhWBfKY2SvBMs7-YGcvq1kSq518z71ycJym5HjJc'

        req['context']['authorization'] = authorization

        if (!token) { return next() }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
          if (err) return next()

          this.models.User
            .findById(decoded.sub)
            .then((user: IUserModel) => {
              if (user) {
                console.log(user)
                req['context']['authUser'] = {
                  id: user.get('id'),
                  email: user.get('email')
                }
              }

              return next()
            })
        })
      },
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
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