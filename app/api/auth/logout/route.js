import { auth } from "@/lib/firebase/firebase-admin-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(request) {
  const session = (await cookies()).get("session")?.value || "";

  //Remove the value and expire the cookie
  const options = {
    name: "session",
    value: "",
    maxAge: -1,
  };
  (await cookies()).set(options);

  auth.verifySessionCookie(session).then((decodedClaims) => {
    return auth.revokeRefreshTokens(decodedClaims.sub);
  });

  redirect("/auth/login");
}
