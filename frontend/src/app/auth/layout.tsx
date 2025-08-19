import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | Poketalk",
  description: "Real Time ChatApplication made in Next.JS + Typescript",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
