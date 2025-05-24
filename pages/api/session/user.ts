import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      if (!req.cookies.session) {
        throw new Error("session cookie not found");
      }

      const user = await getCurrentUser(req.cookies.session);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "not found" });
  }
}
