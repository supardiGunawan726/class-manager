import { createSessionCookie } from "@/lib/firebase/admin/db/user";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body);
      const sessionCookie = await createSessionCookie(body.idToken);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("session", sessionCookie, {
          maxAge: 60 * 60 * 24 * 5 * 1000,
          secure: true,
          httpOnly: true,
        })
      );
      res.status(200).json({ message: "success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "not found" });
  }
}
