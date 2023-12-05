import { auth } from "@/lib/firebase/firebase-admin-config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = cookies().get("session")?.value || "";

  //Remove the value and expire the cookie
  const options = {
    name: "session",
    value: "",
    maxAge: -1,
  };
  cookies().set(options);

  auth.verifySessionCookie(session).then((decodedClaims) => {
    return auth.revokeRefreshTokens(decodedClaims.sub);
  });

  return NextResponse.json({}, { status: 200 });
}
