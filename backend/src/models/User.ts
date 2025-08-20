import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: Types.ObjectId;
}

const UserSchema: Schema<IUserDocument> = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: {type: String, required: true, unique: true, lowercase: true, trim: true, },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

  },
  {
    timestamps: true,
  }
);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default User;