"use client";

import { Eye, EyeOff } from "lucide-react";

export function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-yellow-300 font-medium mb-1 select-none">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-yellow-500 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        required
      />
    </div>
  );
}

export function PasswordInput({
  label,
  id,
  show,
  toggle,
  value,
  onChange,
}: {
  label: string;
  id: string;
  show: boolean;
  toggle: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-yellow-300 font-medium mb-1 select-none">
        {label}
      </label>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="********"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-yellow-500 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        required
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-10 text-yellow-400 hover:text-yellow-300 focus:outline-none select-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
      </button>
    </div>
  );
}