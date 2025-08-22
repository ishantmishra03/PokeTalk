"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useAppSelector } from "@/redux/hooks";
import axios from "@/config/axios";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

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
  createdAt?: string;
}

let socket: Socket | null = null;

export default function ChatMain({ selectedUser }: { selectedUser: User | null }) {
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !selectedUser) return;

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
        auth: { userId: user.id, userName: user.name },
      });
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/message/${selectedUser.id}`);
        if (res.data.success) setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    socket.on("newMessage", (msg: Message) => {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleSend = async () => {
    if (!selectedUser) return;

    let imageBase64: string | undefined;
    if (selectedFile) imageBase64 = await fileToBase64(selectedFile);

    const payload = { text: newMessage.trim() || undefined, image: imageBase64 };
    try {
      const res = await axios.post(`/api/message/send/${selectedUser.id}`, payload);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.newMessage]);
        scrollToBottom();
        setNewMessage("");
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!selectedUser)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting ⚡
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-gray-900 min-h-0">
      {/* Header */}
      <div className="border-b border-yellow-500/30 p-4 text-yellow-400 font-bold text-lg">
        {selectedUser.name}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 flex flex-col">
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
                    width={240}
                    height={240}
                  />
                )}
                <span
                  className={`text-xs ${
                    isSender ? "text-gray-950" : "text-gray-400"
                  } float-right`}
                >
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-yellow-500/30 p-2 flex gap-2 items-center">
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="p-2 text-yellow-300 hover:text-yellow-400"
        >
          <ImageIcon size={24} />
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
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
