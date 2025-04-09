import { ResponseAPI } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookie = req.headers.get("cookie");
  const { id } = await params;

  if (id) {
    const beRes = await fetch(
      `${process.env.BE_API_URL}/surveys/download/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(cookie && { Cookie: cookie }),
        },
        credentials: "include",
      }
    );

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
}