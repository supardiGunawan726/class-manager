import { createSessionCookie } from "@/lib/firebase/admin/db/user";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

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
        serialize("session", sessionCookie, {
          maxAge: 60 * 60 * 24 * 5 * 1000,
          secure: true,
          httpOnly: true,
        })
      );
      res.status(200).json({ message: "success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      serialize("session", "", {
        maxAge: -1,
      })
    );
    res.status(200).json({ message: "success" });
  } else {
    res.status(404).json({ message: "not found" });
  }
}

