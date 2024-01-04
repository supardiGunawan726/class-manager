import { setUserRole } from "@/lib/firebase/admin/db/user";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { origin } = req.nextUrl;

  try {
    const session = req.cookies.get("session");
    const loginResult = await fetch(`${origin}/api/auth/login`, {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });
    const loginResultData = await loginResult.json();
    const user = loginResultData.user;

    if (!user || user.role !== "ketua") {
      throw new Error("User not authorized");
    }

    const requestBody = await req.json();
    await setUserRole(requestBody.uid, requestBody.role);
    return NextResponse.json({
      success: true,
      data: {
        user: {
          uid: requestBody.uid,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}
