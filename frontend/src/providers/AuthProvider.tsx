"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { login, logout, setLoading } from "@/redux/features/authSlice";
import axios from "@/config/axios";
import toast from "react-hot-toast";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function checkAuth() {
      dispatch(setLoading(true));
      try {
        const res = await axios.get("/api/auth");
        if (res.data.success) {
          dispatch(login({ user: res.data.user }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    }

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
}
