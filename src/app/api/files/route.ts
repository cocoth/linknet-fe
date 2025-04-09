import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all files
export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const beRes = await fetch(`${process.env.BE_API_URL}/files`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
    });

    const data = await beRes.json();
    const res = NextResponse.json(data, { status: beRes.status });

    return res;
}

// POST: Upload a new file
export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const formData = await req.formData();

    const beRes = await fetch(`${process.env.BE_API_URL}/files/upload`, {
        method: "POST",
        headers: {
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
        body: formData,
    });

    const data = await beRes.json();
    const res = NextResponse.json(data, { status: beRes.status });

    return res;
}


// DELETE: Delete a file
export async function DELETE(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const url = new URL(req.url);
    const fileId = url.searchParams.get("id"); // Extract file ID from query parameter

    const beRes = await fetch(`${process.env.BE_API_URL}/files?id=${fileId}`, {
        method: "DELETE",
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
