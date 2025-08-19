"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-90 rounded-3xl shadow-2xl p-10 border border-yellow-400">
        <h1
          onClick={handleClick}
          className="text-4xl font-extrabold text-yellow-400 text-center mb-6 select-none tracking-widest drop-shadow-[0_0_10px_rgba(255,223,0,0.7)] cursor-pointer"
        >
          POKÉTALK
        </h1>

        {/* Toggle */}
        <div className="flex mb-8 bg-gray-800 rounded-full overflow-hidden border border-yellow-500">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-center font-semibold transition-colors duration-300 ${
              isLogin
                ? "bg-yellow-400 text-gray-900 shadow-lg scale-105"
                : "text-yellow-300 hover:text-yellow-400"
            }`}
            aria-label="Switch to Login"
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-center font-semibold transition-colors duration-300 ${
              !isLogin
                ? "bg-yellow-400 text-gray-900 shadow-lg scale-105"
                : "text-yellow-300 hover:text-yellow-400"
            }`}
            aria-label="Switch to Sign Up"
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="block text-yellow-300 font-medium mb-1 select-none"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="ash.ketchum@palletmail.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-yellow-500 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-yellow-300 font-medium mb-1 select-none"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-yellow-500 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-yellow-400 hover:text-yellow-300 focus:outline-none select-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          {/* Confirm Password (only for Sign Up) */}
          {!isLogin && (
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-yellow-300 font-medium mb-1 select-none"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-yellow-500 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-yellow-400 hover:text-yellow-300 focus:outline-none select-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 rounded-lg font-bold text-gray-900 hover:bg-yellow-500 transition-colors shadow-lg"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-yellow-300 text-center select-none">
          {isLogin ? "New Trainer?" : "Already a Trainer?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-400 font-semibold underline hover:text-yellow-300 transition-colors"
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
