import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authVerify";
import User from "../models/User";
import Message from "../models/Message";
import cloudinary from "../config/cloudinary";
import { io, userSocketMap } from "..";

//Get users for sidebar
export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages: { [key: string]: number } = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, recieverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);
        res.status(200).json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Get all messages fro loggedIn User
export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.userId;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        });

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { isSeen: true });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Mark message as seen
export const markMessageAsSeen = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { isSeen: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Send a new message
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.userId;

        let imageUrl;
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }

        const newMessage = await Message.create({
            receiverId, senderId, text, image : imageUrl,
        });

        // Emit new message to receiver socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, newMessage});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}