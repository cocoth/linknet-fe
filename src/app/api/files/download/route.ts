import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

// GET: Download a file
export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const url = new URL(req.url);
    const fileId = url.searchParams.get("id"); // Extract file ID from query parameter

    const beRes = await fetch(`${process.env.BE_API_URL}/files/download?id=${fileId}`, {
        method: "GET",
        headers: {
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
    });


    const blob = await beRes.blob();
    const contentDisposition = beRes.headers.get("Content-Disposition");
    let fileName = "downloaded_file";
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
            fileName = match[1];
        }
    }

    const res = new NextResponse(blob, {
        headers: {
            "Content-Type": beRes.headers.get("Content-Type") || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${fileName}"`,
        },
    });

    return res;
}