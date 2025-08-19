"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-6xl font-extrabold mb-6 tracking-wide drop-shadow-lg">
        Welcome to <span className="text-yellow-400">POKÉTALK</span>
      </h1>
      <p className="max-w-lg text-lg mb-12 text-slate-300">
        Your real-time Pokémon chat adventure starts here. Connect, battle, and trade with fellow trainers!
      </p>

      <Link
        href="/auth"
        className="px-10 py-4 bg-yellow-400 text-slate-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
      >
        Start Journey
      </Link>

      <footer className="mt-24 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} PokeTalk. All rights reserved.
      </footer>
    </main>
  );
}
