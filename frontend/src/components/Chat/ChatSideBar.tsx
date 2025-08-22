"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import axios from "@/config/axios";
import { UserCheck, UserX } from "lucide-react";

interface User { id: string; name: string; }
interface Props {
  onlineUsers: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
}

export default function ChatSidebar({ onlineUsers, selectedUser, setSelectedUser }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/message/users");
        if (res.data.success) {
          const normalized = res.data.users.map((u: any) => ({
            id: u._id,
            name: u.name,
          }));
          setAllUsers(normalized);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const usersExceptSelf = allUsers.filter((u) => u.id !== user?.id);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-yellow-400 p-4 border-b border-yellow-500/30">Trainers</h2>
      <div className="flex-1 overflow-y-auto">
        {usersExceptSelf.map((u) => {
          const isOnline = onlineUsers.some((o) => o.id === u.id);
          const isSelected = selectedUser?.id === u.id;
          return (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`px-4 py-3 cursor-pointer flex items-center gap-2 transition-colors ${isSelected ? "bg-yellow-500/20" : "hover:bg-gray-800"}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center`}>
                {isOnline ? <UserCheck size={12} className="text-green-400" /> : <UserX size={12} className="text-gray-500" />}
              </span>
              <p className="font-medium">{u.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
