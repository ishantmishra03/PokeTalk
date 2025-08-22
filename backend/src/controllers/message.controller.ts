import { Response } from "express";
import { AuthRequest } from "../middlewares/authVerify";
import { Types } from "mongoose";
import User from "../models/User";
import Message from "../models/Message";
import cloudinary from "../config/cloudinary";
import { io } from "..";
import { UploadApiResponse } from "cloudinary";
import { userSocketMap } from "../sockets";

// Get users for sidebar 
export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.userId);
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages: { [key: string]: number } = {};
    await Promise.all(
      filteredUsers.map(async (u) => {
        const count = await Message.countDocuments({
          senderId: u._id,
          receiverId: userId,
          isSeen: false,
        });
        if (count > 0) unseenMessages[u._id.toString()] = count;
      })
    );

    res.status(200).json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all messages 
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const myId = new Types.ObjectId(req.userId);
    const selectedUserId = new Types.ObjectId(req.params.id);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, isSeen: false },
      { $set: { isSeen: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Mark a single message as seen 
export const markMessageAsSeen = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    await Message.findByIdAndUpdate(id, { isSeen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send a new message 
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text, image } = req.body;
    const receiverIdStr = req.params.id;
    const senderId = new Types.ObjectId(req.userId);
    const receiverId = new Types.ObjectId(receiverIdStr);

    let imageUrl: string | undefined;
    if (image) {
      const uploadRes: UploadApiResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await Message.create({
      receiverId,
      senderId,
      text,
      image: imageUrl,
    });

    // Emit to receiver 
    const receiverSocketId = userSocketMap[receiverIdStr.toString()];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  

    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
