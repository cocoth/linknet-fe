import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie")
    const { searchParams } = new URL(req.url);
    const fiber_node = searchParams.get("fiber_node") || undefined;

    if (fiber_node) {
        const response = await fetch(`${process.env.BE_API_URL}/ismart?fiber_node=${fiber_node}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(cookie && { Cookie: cookie }),
            },
            credentials: "include",
        });

        const data: ResponseAPI = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: { "Content-Type": "application/json" },
            });
        }

        return NextResponse.json(data)
    } else {
        const response = await fetch(`${process.env.BE_API_URL}/ismart`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(cookie && { Cookie: cookie }),
            },
            credentials: "include",
        });

        const data: ResponseAPI = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: { "Content-Type": "application/json" },
            });
        }

        return NextResponse.json(data)
    }

}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const cookie = req.headers.get("cookie");
    const response = await fetch(`${process.env.BE_API_URL}/ismart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const res: ResponseAPI = await response.json();

    if (!response.ok) {
        return NextResponse.json(res)
    }

    return NextResponse.json(res)
}