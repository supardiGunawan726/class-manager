import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/firebase-admin-config";

export async function POST(request, response) {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const requestBody = await request.json();

    if (decodedToken && requestBody?.role) {
      try {
        // set custom claims
        await auth.setCustomUserClaims(decodedToken.sub, {
          role: requestBody.role,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return NextResponse.json({}, { status: 200 });
}
