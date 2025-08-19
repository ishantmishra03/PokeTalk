import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Public paths that don't require auth
const publicPaths = ["/", "/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const authUrl = new URL("/auth", req.url);
    return NextResponse.redirect(authUrl);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const authUrl = new URL("/auth", req.url);
    return NextResponse.redirect(authUrl);
  }
}

export const config = {
  matcher: [
    "/((?!$|auth(/|$)).*)",
  ],
};
