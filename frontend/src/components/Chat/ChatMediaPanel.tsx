"use client";

import { useEffect, useState } from "react";
import axios from "@/config/axios";
import Image from "next/image";

interface User { id: string; name: string; }
interface Message { _id?: string; senderId: string; receiverId: string; text?: string; image?: string; createdAt?: string; }
interface Props { selectedUser: User | null; currentUserId: string; }

export default function ChatMediaPanel({ selectedUser, currentUserId }: Props) {
  const [mediaMessages, setMediaMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMedia = async () => {
      try {
        const res = await axios.get(`/api/message/${selectedUser.id}`);
        if (res.data.success) {
          setMediaMessages(res.data.messages.filter((m: Message) => m.image));
        }
      } catch (err) { console.error(err); }
    };

    fetchMedia();
  }, [selectedUser]);

  if (!selectedUser) return <div className="w-72 bg-gray-900 border-l border-yellow-500/30 flex items-center justify-center text-gray-500">Select a user to see media 🖼️</div>;

  return (
    <div className="w-72 bg-gray-900 border-l border-yellow-500/30 p-4 overflow-y-auto flex flex-col gap-2 h-full">
      <h2 className="text-yellow-400 font-bold mb-4 text-lg">Media with {selectedUser.name}</h2>
      {mediaMessages.length === 0 && <p className="text-gray-500 text-sm">No media shared yet.</p>}
      {mediaMessages.map((msg) => (
        <div key={msg._id} className="relative w-full h-40 rounded-md overflow-hidden">
          <Image src={msg.image!} alt="shared media" className="object-cover rounded-md" width={288} height={160} />
        </div>
      ))}
    </div>
  );
}
