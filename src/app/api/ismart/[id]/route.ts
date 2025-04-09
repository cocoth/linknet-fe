import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, {params} : {params: Promise<{id : string}>}){
    const data = await req.json();
    const { id } = await params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ismart/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const res:ResponseAPI = await response.json();

    if (!response.ok) {
        return NextResponse.json(res)
    }

    return NextResponse.json(res)
}

export async function DELETE(req: NextRequest, {params} : {params: Promise<{id : string}>}){
    const { id } = await params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ismart/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const res:ResponseAPI = await response.json();

    if (!response.ok) {
        return NextResponse.json(res)
    }

    return NextResponse.json(res)
}