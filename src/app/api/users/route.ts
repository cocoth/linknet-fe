import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    const url = new URL(req.url);
    const name = url.searchParams.get("name"); 
    const callsign = url.searchParams.get("call_sign");
    if (callsign) {
        const beRes = await fetch(`${process.env.BE_API_URL}/users?callsign=${callsign}`, {
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
    } else if (name) {
        const beRes = await fetch(`${process.env.BE_API_URL}/users?name=${name}`, {
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
    } else {
        const beRes = await fetch(`${process.env.BE_API_URL}/users`, {
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
