"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import ChatSidebar from "@/components/Chat/ChatSideBar";
import ChatMain from "@/components/Chat/ChatMain";

interface User {
  id: string;
  name: string;
}

let socket: Socket | null = null;

export default function Chat() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        auth: {
          userId: user.id,
          userName: user.name,
        },
      });
    }

    socket.on("getOnlineUsers", (users: { id: string; name: string }[]) => {
      const normalized = users.map((u) => ({ id: u.id, name: u.name }));
      setOnlineUsers(normalized);
    });

    return () => {
      socket?.off("getOnlineUsers");
    };
  }, [isAuthenticated, user, router]);

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-yellow-300">
      {/* Sidebar */}
      <ChatSidebar
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Main Chat Area */}
      <ChatMain selectedUser={selectedUser} />

      {/* Media Panel Placeholder */}
      <div className="w-80 border-l border-yellow-500/30 hidden lg:flex items-center justify-center text-gray-500">
        Media Panel
      </div>
    </div>
  );
}
