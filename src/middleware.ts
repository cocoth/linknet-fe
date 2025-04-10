import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BE_API_URL || "";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;

  const validateResponse = await fetch(`${API_URL}/admin-validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!validateResponse.ok) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // hanya aktif di /dashboard dan sub-route-nya
    "/survey/:path*",
    "/ismart/:path*",
    "/user-profile/:path*",
  ],
};