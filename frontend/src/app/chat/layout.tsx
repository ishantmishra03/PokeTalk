import ProtectedRoute from "@/providers/ProtectProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Poketalk",
  description: "Real Time ChatApplication made in Next.JS + Typescript",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
        {children}
    </ProtectedRoute>
  );
}
