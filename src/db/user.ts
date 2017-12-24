import { Document, Schema, Model, model } from 'mongoose'
import { IUser } from '../interfaces/IUser'

export interface IUserModel extends IUser, Document { }

export const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema)