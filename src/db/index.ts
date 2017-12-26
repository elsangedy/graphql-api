
import { Mongoose } from 'mongoose'

const mongoose = new Mongoose()
mongoose.Promise = global.Promise

mongoose.set('debug', process.env.NODE_ENV === 'development')

export default mongoose.connect('mongodb://localhost/graphql', {
  useMongoClient: true
})