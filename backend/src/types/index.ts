import { Types } from "mongoose";

export interface IUser{
     _id: Types.ObjectId;
    name: string;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IMessage{
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text: string;
    image: string;
    isSeen : boolean;
}