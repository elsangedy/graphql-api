import { Document, Schema, Model, model } from 'mongoose'

import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

import { IUser } from '../interfaces/IUser'

export interface IUserModel extends IUser, Document {
  checkPassword(password: string): boolean;
}

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

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  const salt = genSaltSync()
  this.password = hashSync(this.password, salt)

  next()
})

UserSchema.methods.checkPassword = function (password: string): Boolean {
  return compareSync(password, this.password)
}

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema)