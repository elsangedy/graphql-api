import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'

class App {
  public express: express.Application

  constructor() {
    this.express = express()
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