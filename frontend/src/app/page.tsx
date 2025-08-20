'use client';

import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/features/authSlice'; 
import api from '@/config/axios';
import toast from 'react-hot-toast';

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const {data} = await api.post('/api/auth/logout');
      if(data.success){
        toast.success(data.message);
        dispatch(logout());
      }
    } catch (error: any) {
      toast.error(error.response?.data.message || "Error logging out");
    }
    
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative">
      
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}

      <h1 className="text-6xl font-extrabold mb-6 tracking-wide drop-shadow-lg">
        Welcome to <span className="text-yellow-400">POKÉTALK</span>
      </h1>
      <p className="max-w-lg text-lg mb-12 text-slate-300">
        Your real-time Pokémon chat adventure starts here. Connect, battle, and trade with fellow trainers!
      </p>

      {isAuthenticated ? (
        <Link
        href="/chat"
        className="px-10 py-4 bg-yellow-400 text-slate-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
      >
        Start Journey
      </Link>
      ) : (
        <Link
        href="/auth"
        className="px-10 py-4 bg-yellow-400 text-slate-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
      >
        Start Journey
      </Link>
      )}

      <footer className="mt-24 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} PokeTalk. All rights reserved.
      </footer>
    </main>
  );
}
