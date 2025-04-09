import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    req: NextRequest,
  ) {
    const cookie = req.headers.get("cookie");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
  
    const beRes = await fetch(`${process.env.BE_API_URL}/users?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie && { Cookie: cookie }),
      },
      credentials: "include",
    });
  
    const data:ResponseAPI = await beRes.json();
    const res = NextResponse.json(data);
  
    return res;
  }

export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const body = await req.json();

    const beRes = await fetch(`${process.env.BE_API_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data:ResponseAPI = await beRes.json();
    const res = NextResponse.json(data);

    return res;
}

