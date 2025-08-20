import mongoose, { Document, Schema, Model } from 'mongoose';
import { IMessage } from '../types';

export interface IMessageDocument extends IMessage, Document { }

const MessageSchema: Schema<IMessageDocument> = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, },
        image: { type: String, },
        isSeen: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

const Message: Model<IMessageDocument> = mongoose.model<IMessageDocument>('Message', MessageSchema);

export default Message;