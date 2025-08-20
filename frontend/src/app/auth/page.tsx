"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/config/axios";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/index";
import { login, setLoading } from "@/redux/features/authSlice";
import { Input, PasswordInput } from "@/ui/Input";

export default function Auth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {loading, isAuthenticated} = useAppSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setLoading(true));

    try {
      if (!formData.email || !formData.password) {
        toast.error("Email and password are required");
        return;
      }

      if (!isLogin) {
        if (!formData.name || !formData.username || !formData.confirmPassword) {
          toast.error("All fields are required for sign up");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const res = await axios.post("/api/auth/register", {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (res.data.success) {
          dispatch(login({ user: res.data.user }));
          toast.success("Account created!");
          router.push("/chat");
        } else {
          toast.error(res.data.message || "Sign up failed");
        }
      } else {
        const res = await axios.post("/api/auth/login", {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });

        if (res.data.success) {
          dispatch(login({ user: res.data.user }));
          toast.success("Welcome back!");
          router.push("/chat");
        } else {
          toast.error(res.data.message || "Login failed");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if(isAuthenticated){
      router.push('/chat');
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-90 rounded-3xl shadow-2xl p-10 border border-yellow-400">
        <h1
          onClick={() => router.push("/")}
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
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <Input
                label="Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Username"
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </>
          )}

          <Input
            label="Email Address"
            id="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
          />

          <PasswordInput
            label="Password"
            id="password"
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            value={formData.password}
            onChange={handleChange}
          />

          {!isLogin && (
            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-gray-900 transition-colors shadow-lg
      ${
        loading
          ? "bg-yellow-300 cursor-not-allowed"
          : "bg-yellow-400 hover:bg-yellow-500"
      }`}
          >
            {loading
              ? isLogin
                ? "Signing In..."
                : "Creating Account..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
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
