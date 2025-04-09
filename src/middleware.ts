import { NextRequest, NextResponse } from "next/server";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const API_URL = process.env.BE_API_URL || "";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const validateResponse = await fetch(`${API_URL}/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${req.cookies.get("session_token")?.value}`,
    },
  });

  console.log(
    "Cookie",
    JSON.stringify(req.cookies.get("session_token")?.value)
  );
  console.log("validateResponse", JSON.stringify(validateResponse));
  if (!validateResponse.ok) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL(req.url));
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
