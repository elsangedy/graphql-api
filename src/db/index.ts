
import { Mongoose } from 'mongoose'

const mongoose = new Mongoose()
mongoose.Promise = global.Promise

mongoose.set('debug', process.env.NODE_ENV === 'development')

const db_name = process.env.NODE_ENV === 'test' ? 'graphql-test' : 'graphql'

export default mongoose.connect(`mongodb://localhost/${db_name}`, {
  useMongoClient: true
})