import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'

import schema from './graphql/schema'

class App {
  public express: express.Application

  constructor() {
    this.express = express()
    this.init()
  }

  private init(): void {
    this.graphql()
  }

  private graphql(): void {
    this.express.use('/graphql',
      graphqlHTTP((req) => ({
        schema,
        graphiql: process.env.NODE_ENV === 'development'
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