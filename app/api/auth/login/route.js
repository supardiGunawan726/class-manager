import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { auth } from "@/lib/firebase/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  try {
    const authorization = (await headers()).get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json({}, { status: 400 });
    }

    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json({}, { status: 401 });
    }

    //Generate session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });
    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };
    //Add the cookie to the browser
    (await cookies()).set(options);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function GET(request) {
  const session = (await cookies()).get("session")?.value || "";

  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false, user: null }, { status: 401 });
  }

  try {
    //Use Firebase Admin to validate the session cookie
    const decodedClaims = await auth.verifySessionCookie(session, true);

    if (!decodedClaims) {
      return NextResponse.json(
        { isLogged: false, user: null },
        { status: 401 }
      );
    }

    const user = await getUserDataByUid(decodedClaims.uid);
    return NextResponse.json({ isLogged: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isLogged: false, user: null }, { status: 401 });
  }
}
