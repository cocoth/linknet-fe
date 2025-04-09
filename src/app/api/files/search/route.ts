import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all files or a specific file by query
export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const url = new URL(req.url);
    const filename = url.searchParams.get("filename");
    const id = url.searchParams.get("id");

    if (id) {
        const beRes = await fetch(`${process.env.BE_API_URL}/files?id=${id}`, {
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
    }else if (filename) {
        const beRes = await fetch(`${process.env.BE_API_URL}/files?filename=${filename}`, {
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