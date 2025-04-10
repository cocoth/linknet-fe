import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const beRes = await fetch(`${process.env.BE_API_URL}/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data:ResponseAPI = await beRes.json();
  const setCookie = beRes.headers.get("set-cookie");

  const res = NextResponse.json(data);

  if (setCookie) {
    res.headers.set("set-cookie", setCookie); // forward cookie ke browser
  }

  return res;
}
