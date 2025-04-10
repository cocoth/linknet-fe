import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const API_URL = process.env.BE_API_URL || "";
    const cookie = req.headers.get("cookie");

    const token = req.cookies.get("session_token")?.value;

    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookie && { Cookie: cookie }),
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });

        const data:ResponseAPI = await response.json();

        if (!response.ok) {
            return NextResponse.json(data)
        }
        
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            code: 400,
            status: "error",
            message: "An error occurred during logout",
            data: null,
        })
    }
}