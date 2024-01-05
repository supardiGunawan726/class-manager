import {
  getUserDataByEmail,
  getUserDataByUid,
  setUserData,
} from "@/lib/firebase/admin/db/user";
import { cleanUndefined } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req, { params }, res) {
  const { origin } = req.nextUrl;

  try {
    const session = req.cookies.get("session");
    const loginResult = await fetch(`${origin}/api/auth/login`, {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });
    const loginResultData = await loginResult.json();
    const loggedUser = loginResultData.user;

    const user = await (params.identifier.includes("@")
      ? getUserDataByEmail(params.identifier)
      : getUserDataByUid(params.identifier));

    if (
      !loggedUser ||
      (loggedUser.role !== "ketua" && loggedUser.uid !== user?.uid)
    ) {
      throw new Error("You're not authorized to perform this request");
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      data: null,
    });
  }
}

export async function POST(req, { params }, res) {
  const { origin } = req.nextUrl;

  try {
    const session = req.cookies.get("session");
    const loginResult = await fetch(`${origin}/api/auth/login`, {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });
    const loginResultData = await loginResult.json();
    const loggedUser = loginResultData.user;

    const user = await (params.identifier.includes("@")
      ? getUserDataByEmail(params.identifier)
      : getUserDataByUid(params.identifier));

    if (
      !loggedUser ||
      (loggedUser.role !== "ketua" && loggedUser.uid !== user?.uid)
    ) {
      throw new Error("You're not authorized to perform this request");
    }

    const requestBody = await req.json();

    await setUserData(
      user.uid,
      cleanUndefined({
        email: requestBody.email,
        role: requestBody.role,
        name: requestBody.name,
        nim: requestBody.nim,
        class_id: requestBody.class_id,
      })
    );
    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      data: null,
    });
  }
}