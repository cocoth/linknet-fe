import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

// PATCH: Update an existing file
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const cookie = req.headers.get("cookie");
    const { id } = await params;
    const formData = await req.formData();

    const beRes = await fetch(`${process.env.BE_API_URL}/files/${id}`, {
        method: "PATCH",
        headers: {
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
        body: formData,
    });

    const data:ResponseAPI = await beRes.json();
    const res = NextResponse.json(data);

    return res;
}