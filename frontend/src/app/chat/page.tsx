"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import io, { Socket } from "socket.io-client";
import ChatSidebar from "@/components/Chat/ChatSideBar";
import ChatMain from "@/components/Chat/ChatMain";
import ChatMediaPanel from "@/components/Chat/ChatMediaPanel";
import { X, Image, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
}

let socket: Socket | null = null;

export default function Chat() {
  const { user } = useAppSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mobile toggles
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    if (!socket && user) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
        auth: { userId: user.id, userName: user.name },
      });
    }

    socket?.on("getOnlineUsers", (users: { id: string; name: string }[]) => {
      setOnlineUsers(users.map((u) => ({ id: u.id, name: u.name })));
    });

    return () => {
      socket?.off("getOnlineUsers");
    };
  }, [user]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-yellow-300 overflow-hidden">
      
      {/* Header for mobile */}
      <div className="md:hidden flex justify-between items-center p-2 border-b border-yellow-500/30">
        <button onClick={() => setShowSidebar(true)}>
          <Users size={24} />
        </button>
        <h1 className="font-bold text-lg truncate">{selectedUser?.name || "POKÉTALK"}</h1>
        <button onClick={() => setShowMedia(true)}>
          <Image size={24} />
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-50 inset-0 md:inset-auto md:flex-shrink-0 w-72 bg-gray-900 border-r border-yellow-500/30 transform transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="md:hidden flex justify-end p-2 border-b border-yellow-500/30">
            <button onClick={() => setShowSidebar(false)}>
              <X size={24} />
            </button>
          </div>
          <ChatSidebar
            onlineUsers={onlineUsers}
            selectedUser={selectedUser}
            setSelectedUser={(u) => {
              setSelectedUser(u);
              setShowSidebar(false);
            }}
          />
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <ChatMain selectedUser={selectedUser} />
        </div>

        {/* Media Panel */}
        <div
          className={`fixed right-0 top-0 z-50 h-full w-80 bg-gray-900 border-l border-yellow-500/30 transform transition-transform duration-300 md:relative md:w-80 md:translate-x-0 ${
            showMedia ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="md:hidden flex justify-end p-2 border-b border-yellow-500/30">
            <button onClick={() => setShowMedia(false)}>
              <X size={24} />
            </button>
          </div>
          <ChatMediaPanel selectedUser={selectedUser} currentUserId={user?.id || ""} />
        </div>

        {/* Overlay for mobile */}
        {(showSidebar || showMedia) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => {
              setShowSidebar(false);
              setShowMedia(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
