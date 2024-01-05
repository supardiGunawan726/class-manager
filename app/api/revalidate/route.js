import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const path = request.nextUrl.searchParams.get("path");
    const type = request.nextUrl.searchParams.get("type");

    if (!path) {
      return NextResponse.json(
        {
          revalidated: false,
          now: Date.now(),
          message: "Missing path to revalidate",
        },
        { status: 400 }
      );
    }

    revalidatePath(path, type);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      {
        revalidated: false,
        now: Date.now(),
        message: error.message,
      },
      { status: 500 }
    );
  }
}
