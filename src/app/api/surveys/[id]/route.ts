import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookie = req.headers.get("cookie");
    const { id } = await params;
    const body = await req.json()

    if (id) {
        const beRes = await fetch(`${process.env.BE_API_URL}/surveys/${id}`, {
            method: "PATCH",
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
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookie = req.headers.get("cookie");
    const { id } = await params;

    if (id) {
        const beRes = await fetch(`${process.env.BE_API_URL}/surveys/${id}`, {
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
}