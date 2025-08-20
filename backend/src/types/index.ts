import { ObjectId } from "mongoose";

export interface IUser{
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IMessage{
    senderId: string;
    receiverId: string;
    text: string;
    image: string;
    isSeen : boolean;
}