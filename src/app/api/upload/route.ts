import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
          addRandomSuffix: true,
          token: process.env.BLOB_READ_WRITE_TOKEN!,
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload complete:", blob);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
