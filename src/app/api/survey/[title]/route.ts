import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ title: string }> }
) {
  const cookie = req.headers.get("cookie");
  const { title } = await params;

  if (title) {
    const beRes = await fetch(
      `${process.env.BE_API_URL}/surveys?title=${title}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
      }
    );

    const data:ResponseAPI = await beRes.json();
    const res = NextResponse.json(data);

    return res;
  } else {
    const beRes = await fetch(`${process.env.BE_API_URL}/surveys`, {
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
}
