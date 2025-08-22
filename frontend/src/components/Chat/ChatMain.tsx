"use client";

import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import axios from "@/config/axios";
import io, { Socket } from "socket.io-client";
import Image from "next/image";

interface User {
  id: string;
  name: string;
}

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  isSeen?: boolean;
  createdAt?: string;
}

let socket: Socket | null = null;

export default function ChatMain({ selectedUser }: { selectedUser: User | null }) {
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !selectedUser) return;

    // Initialize socket
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
        auth: { userId: user.id, userName: user.name },
      });
    }

    // Fetch old messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/message/${selectedUser.id}`);
        if (res.data.success) setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    // Listen for real-time messages
    socket.on("newMessage", (msg: Message) => {
      // Only add if message belongs to this chat
      if (
        (msg.senderId === selectedUser.id && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [selectedUser, user]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = { text: newMessage };

    try {
      const res = await axios.post(`/api/message/send/${selectedUser.id}`, messageData);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.newMessage]);
        scrollToBottom();
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting ⚡
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="border-b border-yellow-500/30 p-4 text-yellow-400 font-bold text-lg">
        {selectedUser.name}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isSender = msg.senderId === user?.id;
          return (
            <div
              key={msg._id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-2 rounded-xl break-words ${
                  isSender ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-yellow-300"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <Image
                    src={msg.image}
                    alt="sent media"
                    className="mt-1 rounded-md max-h-60 w-auto"
                  />
                )}
                <span className={`text-xs ${isSender ? "text-gray-950" : "text-gray-400"} float-right`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-yellow-500/30 p-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-yellow-300 px-4 py-2 rounded-xl focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-yellow-500 transition-colors"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
