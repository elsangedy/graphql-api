
import { Mongoose } from 'mongoose'

const mongoose = new Mongoose()
mongoose.Promise = global.Promise

export default mongoose.connect('mongodb://localhost/graphql', {
  useMongoClient: true
})