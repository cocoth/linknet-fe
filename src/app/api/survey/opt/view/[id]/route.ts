import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const cookie = req.headers.get("cookie");
    const { id } = await params;
    
    const beRes = await fetch(`${process.env.BE_API_URL}/surveys/view/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
    });

    const data: ResponseAPI = await beRes.json();
    
    const res = NextResponse.json(data);
    
    return res;
}